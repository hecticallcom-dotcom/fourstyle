/* ===== FOURSTYLE — Data Layer (store.js) =====================================

   One small wrapper that every page (shop + admin) uses to read/write data.

   It talks to the Firebase Realtime Database when that database is reachable and
   its rules allow access. If it is not reachable (rules locked, offline, or the
   site is opened from a file) it transparently falls back to this browser's
   safe local storage so the whole site — including the admin panel — stays fully usable
   for review and demos.

   Paths used:
     products/        full product catalogue (inventory)
     orders/          customer orders
     slips/           uploaded payment slips
     messages/        Contact Us form submissions
     stats/           visits + logins

   To make the data permanent for every visitor, open the Firebase console for the
   "fourstyle" project -> Realtime Database -> Rules, and publish the rules given
   in SETUP-FIREBASE.md. Nothing else in the code has to change.
============================================================================= */
(function () {
  const LS_ROOT = 'fourstyle_db';
  let db = null;
  let cloud = false;          // becomes true once a cloud read succeeds
  let readyResolve;
  const ready = new Promise(r => (readyResolve = r));

  /* The local fallback keeps ONE json tree, so paths like "orders/FS123" nest
     exactly the way they do in the Realtime Database. */
  function readTree() {
    try { return JSON.parse(FSLS.getItem(LS_ROOT) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeTree(tree) {
    try { FSLS.setItem(LS_ROOT, JSON.stringify(tree)); return true; }
    catch (e) { console.warn('[store] local save failed (storage full?)', e); return false; }
  }
  function lsGet(path) {
    const parts = String(path).split('/').filter(Boolean);
    let cur = readTree();
    for (const p of parts) {
      if (cur && typeof cur === 'object' && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else return null;
    }
    return cur === undefined ? null : cur;
  }
  function lsSet(path, value) {
    const parts = String(path).split('/').filter(Boolean);
    if (!parts.length) return;
    const tree = readTree();
    let cur = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    const last = parts[parts.length - 1];
    if (value === null) delete cur[last];
    else cur[last] = value;
    writeTree(tree);
  }

  function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout')), ms);
      promise.then(v => { clearTimeout(t); resolve(v); },
                   e => { clearTimeout(t); reject(e); });
    });
  }

  /* ---------- connection probe ---------- */
  function probe() {
    try {
      if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length) {
        readyResolve(false); return;
      }
      db = firebase.database();
      withTimeout(db.ref('products').limitToFirst(1).once('value'), 6000)
        .then(() => { cloud = true; readyResolve(true); })
        .catch(() => { cloud = false; readyResolve(false); });
    } catch (e) { readyResolve(false); }
  }
  probe();

  /* ---------- primitives ---------- */
  async function read(path, fallback) {
    await ready;
    if (cloud) {
      try {
        const snap = await withTimeout(db.ref(path).once('value'), 8000);
        const val = snap.val();
        if (val !== null && val !== undefined) { lsSet(path, val); return val; }
        // cloud reachable but empty -> use whatever we have locally
        const local = lsGet(path);
        return local !== null ? local : fallback;
      } catch (e) { cloud = false; }
    }
    const local = lsGet(path);
    return local !== null ? local : fallback;
  }

  async function write(path, value) {
    lsSet(path, value);                       // always keep a local mirror
    await ready;
    if (cloud) {
      try { await withTimeout(db.ref(path).set(value), 10000); return true; }
      catch (e) { cloud = false; }
    }
    return false;
  }

  async function update(path, patch) {
    const current = (await read(path, {})) || {};
    const merged = Object.assign({}, current, patch);
    return write(path, merged);
  }

  async function remove(path) {
    lsSet(path, null);
    await ready;
    if (cloud) {
      try { await withTimeout(db.ref(path).remove(), 10000); return true; }
      catch (e) { cloud = false; }
    }
    return false;
  }

  /* map <-> array helpers (Realtime DB stores objects, the UI wants arrays) */
  function toArray(obj) {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj.filter(Boolean);
    return Object.keys(obj).map(k => Object.assign({ _key: k }, obj[k]));
  }

  /* ---------- products / inventory ---------- */
  function normalise(p, i) {
    const imgs = (p.images && p.images.length ? p.images : [p.image]).filter(Boolean);
    const price = Number(p.price) || 0;
    const original = Number(p.original) || 0;
    return {
      id: Number(p.id) || (Date.now() + i),
      sku: p.sku || '',
      name: p.name || 'Untitled product',
      price,
      original,
      discount: original > price ? Math.round((1 - price / original) * 100) : 0,
      category: (p.category || 'other').toString().toLowerCase().trim().replace(/\s+/g, '-'),
      brand: p.brand || 'Fourstyle',
      images: imgs,
      image: imgs[0] || '',
      stock: p.stock === undefined || p.stock === '' ? 0 : Number(p.stock),
      lowStock: p.lowStock === undefined || p.lowStock === '' ? 5 : Number(p.lowStock),
      description: p.description || '',
      updated: p.updated || Date.now()
    };
  }

  async function getProducts() {
    const raw = await read('products', null);
    let list = raw ? toArray(raw) : null;
    if (!list || !list.length) list = (window.SEED_PRODUCTS || []).slice();
    return list.map(normalise);
  }

  async function saveProducts(list) {
    const clean = list.map(normalise);
    const map = {};
    clean.forEach(p => { map['p' + p.id] = p; });
    await write('products', map);
    return clean;
  }

  async function saveProduct(product) {
    const list = await getProducts();
    const p = normalise(product, 0);
    const i = list.findIndex(x => x.id === p.id);
    if (i >= 0) list[i] = p; else list.push(p);
    return saveProducts(list);
  }

  async function deleteProduct(id) {
    const list = (await getProducts()).filter(p => p.id !== Number(id));
    return saveProducts(list);
  }

  async function decrementStock(items) {
    try {
      const list = await getProducts();
      let touched = false;
      items.forEach(it => {
        const p = list.find(x => x.id === Number(it.id));
        if (p) { p.stock = Math.max(0, (Number(p.stock) || 0) - (Number(it.qty) || 1)); touched = true; }
      });
      if (touched) await saveProducts(list);
    } catch (e) { console.warn('[store] stock update skipped', e); }
  }

  /* ---------- orders ---------- */
  async function getOrders() {
    const raw = await read('orders', null);
    const list = toArray(raw);
    return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
  async function saveOrder(order) { return write('orders/' + order.id, order); }
  async function updateOrder(id, patch) { return update('orders/' + id, patch); }
  async function deleteOrder(id) { return remove('orders/' + id); }

  /* ---------- payment slips ---------- */
  async function saveSlip(slip) {
    const id = slip.id || ('SLIP' + Date.now());
    slip.id = id;
    await write('slips/' + id, slip);
    return id;
  }
  async function getSlips() {
    const list = toArray(await read('slips', null));
    return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
  async function updateSlip(id, patch) { return update('slips/' + id, patch); }
  async function deleteSlip(id) { return remove('slips/' + id); }

  /* ---------- contact messages ---------- */
  async function saveMessage(msg) {
    const id = 'MSG' + Date.now();
    msg.id = id;
    await write('messages/' + id, msg);
    return id;
  }
  async function getMessages() {
    const list = toArray(await read('messages', null));
    return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
  async function updateMessage(id, patch) { return update('messages/' + id, patch); }
  async function deleteMessage(id) { return remove('messages/' + id); }

  /* ---------- stats ---------- */
  async function trackVisit() {
    try {
      if (FSLS.getItem('fourstyle_visited_session')) return;
      FSLS.setItem('fourstyle_visited_session', '1');
      const key = 'v' + Date.now();
      await write('stats/visits/' + key, { time: new Date().toLocaleString('en-PK'), timestamp: Date.now(), page: location.pathname });
    } catch (e) {}
  }
  async function trackLogin(user) {
    try {
      const key = 'l' + Date.now();
      await write('stats/logins/' + key, {
        email: user.email, name: user.name, role: user.role || 'user',
        time: new Date().toLocaleString('en-PK'), timestamp: Date.now()
      });
    } catch (e) {}
  }
  async function getStats() {
    const s = (await read('stats', {})) || {};
    return { visits: toArray(s.visits), logins: toArray(s.logins) };
  }

  /* ---------- image helper: compress a File to a small data URL ---------- */
  function fileToCompressedDataURL(file, maxSide, quality) {
    maxSide = maxSide || 1100;
    quality = quality || 0.72;
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file'));
      if (!/^image\//.test(file.type) && file.type !== 'application/pdf') {
        return reject(new Error('Please choose an image file (JPG or PNG).'));
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read the file.'));
      reader.onload = () => {
        if (file.type === 'application/pdf') return resolve(reader.result);
        const img = new Image();
        img.onerror = () => reject(new Error('Could not open the image.'));
        img.onload = () => {
          let { width, height } = img;
          const scale = Math.min(1, maxSide / Math.max(width, height));
          width = Math.round(width * scale); height = Math.round(height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          try { resolve(canvas.toDataURL('image/jpeg', quality)); }
          catch (e) { resolve(reader.result); }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  window.FSStore = {
    ready,
    isCloud: () => cloud,
    storageLabel: () => (cloud ? 'Cloud database (Firebase) — live for all visitors'
                              : 'Local mode — data saved in this browser only'),
    getProducts, saveProducts, saveProduct, deleteProduct, decrementStock,
    getOrders, saveOrder, updateOrder, deleteOrder,
    saveSlip, getSlips, updateSlip, deleteSlip,
    saveMessage, getMessages, updateMessage, deleteMessage,
    trackVisit, trackLogin, getStats,
    fileToCompressedDataURL,
    _read: read, _write: write
  };
})();
