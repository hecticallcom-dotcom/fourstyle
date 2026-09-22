/* ===== FOURSTYLE — Admin Panel Script ===================================== */

/* ---------------------------------------------------------------- auth guard */
const session = (() => {
  try { return JSON.parse(FSLS.getItem('fourstyle_session') || 'null'); }
  catch (e) { return null; }
})();
if (!session || session.role !== 'admin') {
  window.location.replace('login.html');
}
document.getElementById('adminName').textContent = (session && session.name) || 'Admin';
document.getElementById('adminEmail').textContent = (session && session.email) || '';

function logout() {
  FSLS.removeItem('fourstyle_session');
  window.location.replace('login.html');
}

/* -------------------------------------------------------------------- state */
let ORDERS = [], SLIPS = [], PRODUCTS = [], MESSAGES = [];
let orderFilter = 'all';
let reportMode = 'daily';
let dailyChart = null, monthlyChart = null;

const rs = n => 'Rs.' + Number(n || 0).toLocaleString('en-PK');
const esc = s => String(s === undefined || s === null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dayKey = ts => {
  const d = new Date(ts || Date.now());
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};
const monthKey = ts => {
  const d = new Date(ts || Date.now());
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
};
const monthLabel = key => {
  const [y, m] = key.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' });
};

/* ------------------------------------------------------------ navigation UI */
const TITLES = {
  dashboard: ['Dashboard', 'Orders, inventory, payments and store performance'],
  orders:    ['Orders', 'Review, confirm and track every customer order'],
  slips:     ['Payment Slips', 'Payment receipts uploaded by customers at checkout'],
  inventory: ['Inventory', 'Add, edit and import products; watch low stock'],
  reports:   ['Reports', 'Daily sales report and monthly chart, exportable to Excel'],
  messages:  ['Messages', 'Questions submitted through the Contact Us page']
};
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === 'section-' + name));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === name));
  const t = TITLES[name] || ['Dashboard', ''];
  document.getElementById('pageTitle').textContent = t[0];
  document.getElementById('pageSubtitle').textContent = t[1];
  closeSidebar();
  if (name === 'reports') renderReports();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function openModal(id) { document.getElementById(id).classList.add('active'); }

/* ------------------------------------------------------------- data loading */
async function refreshAll() {
  const banner = document.getElementById('storageBanner');
  banner.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i><span>Loading data…</span>';
  [ORDERS, SLIPS, PRODUCTS, MESSAGES] = await Promise.all([
    FSStore.getOrders(), FSStore.getSlips(), FSStore.getProducts(), FSStore.getMessages()
  ]);
  const cloud = FSStore.isCloud();
  banner.className = 'storage-banner' + (cloud ? ' cloud' : '');
  banner.innerHTML = cloud
    ? '<i class="fas fa-cloud"></i><span><strong>Cloud database connected.</strong> Products, orders, payment slips and messages are saved online and visible to every visitor.</span>'
    : (window.FSLS && FSLS.mode === 'temporary')
      ? '<i class="fas fa-triangle-exclamation"></i><span><strong>Review mode:</strong> this preview cannot use browser storage, so anything you add is kept only for this browser tab. Everything works exactly the same on the real site; publish the database rules from <code>SETUP-FIREBASE.md</code> in the Firebase console to make the data permanent and shared across devices.</span>'
      : '<i class="fas fa-triangle-exclamation"></i><span><strong>Local mode:</strong> data is currently saved in this browser only, so it is perfect for review but will not sync between devices. Publish the database rules from <code>SETUP-FIREBASE.md</code> in the Firebase console to switch this to permanent cloud storage — no other change is needed.</span>';

  renderDashboard();
  renderOrders();
  renderSlips();
  renderInventory();
  renderReports();
  renderMessages();
  updatePills();
}

function updatePills() {
  const setPill = (id, n) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = n;
    el.style.display = n > 0 ? 'inline-block' : 'none';
  };
  setPill('pillOrders', ORDERS.filter(o => o.status === 'Pending' || o.status === 'Payment slip received').length);
  setPill('pillSlips', SLIPS.filter(s => (s.status || '').toLowerCase().indexOf('pending') === 0).length);
  setPill('pillMessages', MESSAGES.filter(m => m.status === 'New').length);
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */
function statusBadge(status) {
  const s = (status || 'Pending').toLowerCase();
  const cls = s.includes('slip') ? 'slip' : s.includes('confirm') ? 'confirmed'
    : s.includes('ship') ? 'shipped' : s.includes('deliver') ? 'delivered'
    : s.includes('cancel') ? 'cancelled' : 'pending';
  return '<span class="badge ' + cls + '">' + esc(status || 'Pending') + '</span>';
}
function orderActions(o) {
  let h = '<button class="btn btn-outline btn-sm" onclick="viewOrder(\'' + o.id + '\')" title="View"><i class="fas fa-eye"></i> View</button>';
  if (o.status !== 'Confirmed' && o.status !== 'Shipped' && o.status !== 'Delivered')
    h += '<button class="btn btn-success btn-sm" onclick="setStatus(\'' + o.id + '\',\'Confirmed\')"><i class="fas fa-check"></i> Confirm</button>';
  if (o.status === 'Confirmed')
    h += '<button class="btn btn-info btn-sm" onclick="setStatus(\'' + o.id + '\',\'Shipped\')">Ship</button>';
  if (o.status === 'Shipped')
    h += '<button class="btn btn-purple btn-sm" onclick="setStatus(\'' + o.id + '\',\'Delivered\')">Deliver</button>';
  h += '<button class="btn btn-danger btn-sm" onclick="removeOrder(\'' + o.id + '\')" title="Delete"><i class="fas fa-trash"></i> Delete</button>';
  return h;
}
const slipCell = o => o.slipUploaded
  ? '<span class="badge confirmed"><i class="fas fa-check"></i> Yes</span>'
  : '<span class="badge pending">No</span>';

function renderDashboard() {
  const revenue = ORDERS.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const today = dayKey(Date.now());
  const todaySales = ORDERS.filter(o => dayKey(o.timestamp) === today).reduce((s, o) => s + (Number(o.total) || 0), 0);
  const low = PRODUCTS.filter(p => p.stock <= p.lowStock);

  document.getElementById('statOrders').textContent = ORDERS.length;
  document.getElementById('statRevenue').textContent = Number(revenue).toLocaleString('en-PK');
  document.getElementById('statPending').textContent = ORDERS.filter(o => o.status === 'Pending').length;
  document.getElementById('statConfirmed').textContent = ORDERS.filter(o => o.status === 'Confirmed').length;
  document.getElementById('statSlips').textContent = SLIPS.length;
  document.getElementById('statLow').textContent = low.length;
  document.getElementById('statProducts').textContent = PRODUCTS.length;
  document.getElementById('statToday').textContent = Number(todaySales).toLocaleString('en-PK');

  const recent = ORDERS.slice(0, 6);
  document.getElementById('recentOrdersBody').innerHTML = recent.length ? recent.map(o => `
    <tr>
      <td><strong>${esc(o.id)}</strong></td>
      <td>${esc(o.name)}</td>
      <td>${rs(o.total)}</td>
      <td>${esc(o.payment)}</td>
      <td>${slipCell(o)}</td>
      <td>${statusBadge(o.status)}</td>
      <td class="actions">${orderActions(o)}</td>
    </tr>`).join('')
    : '<tr class="empty-row"><td colspan="7">No orders yet. Orders placed on the website will appear here.</td></tr>';

  document.getElementById('lowStockBody').innerHTML = low.length ? low.map(p => `
    <tr class="low-stock">
      <td><strong>${esc(p.name)}</strong></td>
      <td>${esc(p.sku)}</td>
      <td>${esc(p.category)}</td>
      <td><span class="stock-pill low">${p.stock}</span>${p.stock <= 0 ? '<span class="running-out">Out of stock</span>' : '<span class="running-out">Running out</span>'}</td>
      <td><button class="btn btn-outline btn-sm" onclick="openProductForm(${p.id})"><i class="fas fa-pen"></i> Edit</button></td>
    </tr>`).join('')
    : '<tr class="empty-row"><td colspan="5">All products have healthy stock levels.</td></tr>';
}

/* =========================================================================
   ORDERS
   ========================================================================= */
function setOrderFilter(f) {
  orderFilter = f;
  document.querySelectorAll('#orderTabs .filter-tab').forEach(b => b.classList.toggle('active', b.dataset.filter === f));
  renderOrders();
}
function visibleOrders() {
  const q = (document.getElementById('orderSearch').value || '').toLowerCase().trim();
  return ORDERS.filter(o => {
    const okFilter = orderFilter === 'all' || o.status === orderFilter;
    const okSearch = !q ||
      String(o.id).toLowerCase().includes(q) ||
      String(o.name || '').toLowerCase().includes(q) ||
      String(o.phone || '').toLowerCase().includes(q) ||
      String(o.email || '').toLowerCase().includes(q);
    return okFilter && okSearch;
  });
}
function renderOrders() {
  const list = visibleOrders();
  document.getElementById('ordersBody').innerHTML = list.length ? list.map(o => `
    <tr>
      <td><strong>${esc(o.id)}</strong></td>
      <td>${esc(o.date)}</td>
      <td>${esc(o.name)}</td>
      <td>${esc(o.phone)}<br><span style="color:var(--muted);font-size:11.5px">${esc(o.email)}</span></td>
      <td>${rs(o.total)}</td>
      <td>${esc(o.payment)}</td>
      <td>${slipCell(o)}</td>
      <td>${statusBadge(o.status)}</td>
      <td class="actions">${orderActions(o)}</td>
    </tr>`).join('')
    : '<tr class="empty-row"><td colspan="9">No orders match this view.</td></tr>';
}

function viewOrder(id) {
  const o = ORDERS.find(x => x.id === id);
  if (!o) return;
  const slip = SLIPS.find(s => s.orderId === id);
  document.getElementById('detailTitle').textContent = 'Order ' + o.id;
  document.getElementById('detailBody').innerHTML = `
    <div class="detail-list">
      <div class="row"><span>Date</span><span>${esc(o.date)}</span></div>
      <div class="row"><span>Customer</span><span>${esc(o.name)}</span></div>
      <div class="row"><span>WhatsApp / phone</span><span>${esc(o.phone)}</span></div>
      <div class="row"><span>Email</span><span>${esc(o.email)}</span></div>
      <div class="row"><span>Address</span><span>${esc(o.address)}</span></div>
      ${o.notes ? `<div class="row"><span>Notes</span><span>${esc(o.notes)}</span></div>` : ''}
      <div class="row"><span>Payment method</span><span>${esc(o.payment)}</span></div>
      <div class="row"><span>Subtotal</span><span>${rs(o.subtotal || (o.total - (o.delivery || 0)))}</span></div>
      <div class="row"><span>Delivery</span><span>${rs(o.delivery || 250)}</span></div>
      <div class="row"><span>Total</span><span><strong>${rs(o.total)}</strong></span></div>
      <div class="row"><span>Status</span><span>${statusBadge(o.status)}</span></div>
    </div>
    <div class="detail-items">
      <h4 style="font-size:13.5px;margin-bottom:6px;">Items</h4>
      ${(o.items || []).map(i => `
        <div class="di">
          <img src="${esc(i.image)}" alt="">
          <div style="flex:1"><strong>${esc(i.name)}</strong><div style="color:var(--muted);font-size:12px">${esc(i.sku || '')} · Qty ${i.qty} × ${rs(i.price)}</div></div>
          <span>${rs(i.price * i.qty)}</span>
        </div>`).join('')}
    </div>
    ${slip ? `
      <div style="margin-top:16px;">
        <h4 style="font-size:13.5px;margin-bottom:8px;">Payment slip</h4>
        <img src="${esc(slip.image)}" alt="Payment slip" style="max-width:280px;max-height:320px;object-fit:contain;border-radius:10px;border:1px solid var(--border);cursor:zoom-in" onclick="viewSlip('${slip.id}')">
        <p style="font-size:12px;color:var(--muted);margin-top:6px;">Uploaded ${esc(slip.date)} · ${esc(slip.status)}</p>
      </div>` : '<p style="font-size:12.5px;color:var(--muted);margin-top:14px;">No payment slip uploaded for this order.</p>'}
    <div class="modal-actions">
      <button class="btn btn-success" onclick="setStatus('${o.id}','Confirmed')"><i class="fas fa-check"></i> Confirm order</button>
      <button class="btn btn-info" onclick="setStatus('${o.id}','Shipped')">Mark shipped</button>
      <button class="btn btn-purple" onclick="setStatus('${o.id}','Delivered')">Mark delivered</button>
      <a class="btn btn-outline" href="https://wa.me/${String(o.phone || '').replace(/\D/g, '').replace(/^0/, '92')}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp customer</a>
    </div>`;
  openModal('detailModal');
}

async function setStatus(id, status) {
  await FSStore.updateOrder(id, { status });
  const o = ORDERS.find(x => x.id === id);
  if (o) o.status = status;
  closeModal('detailModal');
  renderDashboard(); renderOrders(); updatePills();
}
async function removeOrder(id) {
  if (!confirm('Delete order ' + id + '? This cannot be undone.')) return;
  await FSStore.deleteOrder(id);
  ORDERS = ORDERS.filter(o => o.id !== id);
  renderDashboard(); renderOrders(); updatePills();
}

/* =========================================================================
   PAYMENT SLIPS
   ========================================================================= */
function renderSlips() {
  const q = (document.getElementById('slipSearch').value || '').toLowerCase().trim();
  const list = SLIPS.filter(s => !q ||
    String(s.orderId || '').toLowerCase().includes(q) ||
    String(s.customer || '').toLowerCase().includes(q) ||
    String(s.phone || '').toLowerCase().includes(q));

  document.getElementById('slipGrid').innerHTML = list.length ? list.map(s => `
    <div class="slip-card">
      <div class="slip-img" onclick="viewSlip('${s.id}')">
        ${/^data:application\/pdf/.test(s.image || '')
          ? '<i class="fas fa-file-pdf" style="font-size:38px;color:#b91c1c"></i>'
          : `<img src="${esc(s.image)}" alt="Slip for ${esc(s.orderId)}">`}
      </div>
      <div class="slip-meta">
        <strong>${esc(s.orderId)}</strong> ${statusBadge(s.status)}
        <p>${esc(s.customer)} · ${esc(s.phone)}</p>
        <p>${rs(s.amount)} · ${esc(s.payment)}</p>
        <p>${esc(s.date)}</p>
      </div>
      <div class="slip-actions">
        <button class="btn btn-success btn-sm" onclick="setSlipStatus('${s.id}','Verified')"><i class="fas fa-check"></i> Verify</button>
        <button class="btn btn-outline btn-sm" onclick="setSlipStatus('${s.id}','Rejected')">Reject</button>
        <button class="btn btn-danger btn-sm" onclick="removeSlip('${s.id}')"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>`).join('')
    : '<p style="color:var(--muted);font-size:13px;padding:20px 0;">No payment slips uploaded yet. Slips that customers upload after paying appear here automatically.</p>';
}

function viewSlip(id) {
  const s = SLIPS.find(x => x.id === id);
  if (!s) return;
  document.getElementById('slipModalTitle').textContent = 'Payment slip — ' + s.orderId;
  document.getElementById('slipModalBody').innerHTML = `
    <div class="detail-list">
      <div class="row"><span>Order ID</span><span>${esc(s.orderId)}</span></div>
      <div class="row"><span>Customer</span><span>${esc(s.customer)}</span></div>
      <div class="row"><span>Phone</span><span>${esc(s.phone)}</span></div>
      <div class="row"><span>Email</span><span>${esc(s.email)}</span></div>
      <div class="row"><span>Amount</span><span><strong>${rs(s.amount)}</strong></span></div>
      <div class="row"><span>Method</span><span>${esc(s.payment)}</span></div>
      <div class="row"><span>Uploaded</span><span>${esc(s.date)}</span></div>
      <div class="row"><span>Status</span><span>${statusBadge(s.status)}</span></div>
    </div>
    ${/^data:application\/pdf/.test(s.image || '')
      ? `<a class="btn btn-outline" style="margin-top:14px" href="${esc(s.image)}" download="${esc(s.fileName)}"><i class="fas fa-download"></i> Download PDF slip</a>`
      : `<img src="${esc(s.image)}" alt="Payment slip" style="margin-top:14px;width:100%;max-height:440px;object-fit:contain;border-radius:12px;border:1px solid var(--border)">`}
    <div class="modal-actions">
      <button class="btn btn-success" onclick="setSlipStatus('${s.id}','Verified')"><i class="fas fa-check"></i> Mark verified &amp; confirm order</button>
      <button class="btn btn-outline" onclick="setSlipStatus('${s.id}','Rejected')">Reject slip</button>
      <a class="btn btn-outline" href="${esc(s.image)}" download="${esc(s.fileName || 'slip.jpg')}"><i class="fas fa-download"></i> Download</a>
    </div>`;
  openModal('slipModal');
}

async function setSlipStatus(id, status) {
  const s = SLIPS.find(x => x.id === id);
  if (!s) return;
  await FSStore.updateSlip(id, { status });
  s.status = status;
  if (status === 'Verified' && s.orderId) {
    await FSStore.updateOrder(s.orderId, { status: 'Confirmed' });
    const o = ORDERS.find(x => x.id === s.orderId);
    if (o) o.status = 'Confirmed';
  }
  closeModal('slipModal');
  renderSlips(); renderOrders(); renderDashboard(); updatePills();
}
async function removeSlip(id) {
  if (!confirm('Delete this payment slip?')) return;
  await FSStore.deleteSlip(id);
  SLIPS = SLIPS.filter(s => s.id !== id);
  renderSlips(); updatePills();
}

/* =========================================================================
   INVENTORY
   ========================================================================= */
function renderInventory() {
  const q = (document.getElementById('invSearch').value || '').toLowerCase().trim();
  const list = PRODUCTS.filter(p => !q ||
    p.name.toLowerCase().includes(q) ||
    String(p.sku).toLowerCase().includes(q) ||
    String(p.brand).toLowerCase().includes(q) ||
    String(p.category).toLowerCase().includes(q));

  const units = PRODUCTS.reduce((s, p) => s + (Number(p.stock) || 0), 0);
  const value = PRODUCTS.reduce((s, p) => s + (Number(p.stock) || 0) * (Number(p.price) || 0), 0);
  const low = PRODUCTS.filter(p => p.stock <= p.lowStock);
  document.getElementById('invTotal').textContent = PRODUCTS.length;
  document.getElementById('invUnits').textContent = units.toLocaleString('en-PK');
  document.getElementById('invLow').textContent = low.length;
  document.getElementById('invValue').textContent = value.toLocaleString('en-PK');

  document.getElementById('inventoryBody').innerHTML = list.length ? list.map(p => {
    const isLow = p.stock <= p.lowStock;
    return `<tr class="${isLow ? 'low-stock' : ''}">
      <td><img class="thumb-cell" src="${esc(p.image)}" alt=""></td>
      <td><strong>${esc(p.name)}</strong>${p.discount ? `<br><span style="font-size:11.5px;color:var(--muted)">-${p.discount}% off</span>` : ''}</td>
      <td>${esc(p.sku)}</td>
      <td>${esc(p.category)}</td>
      <td>${esc(p.brand)}</td>
      <td>${rs(p.price)}${p.original > p.price ? `<br><span style="font-size:11px;color:var(--muted);text-decoration:line-through">${rs(p.original)}</span>` : ''}</td>
      <td>${(p.images || []).length}</td>
      <td><span class="stock-pill ${isLow ? 'low' : 'ok'}">${p.stock}</span>${p.stock <= 0 ? '<span class="running-out">Out of stock</span>' : isLow ? '<span class="running-out">Running out</span>' : ''}</td>
      <td class="actions">
        <button class="btn btn-outline btn-sm" onclick="openProductForm(${p.id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn btn-danger btn-sm" onclick="removeProduct(${p.id})"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>`;
  }).join('')
    : '<tr class="empty-row"><td colspan="9">No products match your search.</td></tr>';

  // datalists for the add/edit form
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category)));
  const brands = Array.from(new Set(PRODUCTS.map(p => p.brand)));
  document.getElementById('categoryOptions').innerHTML = cats.map(c => `<option value="${esc(c)}">`).join('');
  document.getElementById('brandOptions').innerHTML = brands.map(b => `<option value="${esc(b)}">`).join('');
}

/* ---------- add / edit form ---------- */
function addImageRow(value) {
  const rows = document.getElementById('imageRows');
  const div = document.createElement('div');
  div.className = 'image-row';
  div.innerHTML = `
    <img src="${value ? esc(value) : ''}" alt="" onerror="this.style.visibility='hidden'">
    <input type="url" placeholder="https://… image link" value="${value ? esc(value) : ''}"
           oninput="const i=this.previousElementSibling; i.src=this.value; i.style.visibility='visible';">
    <button type="button" onclick="this.parentElement.remove()" title="Remove"><i class="fas fa-times"></i></button>`;
  rows.appendChild(div);
}

function openProductForm(id) {
  const p = id ? PRODUCTS.find(x => x.id === Number(id)) : null;
  document.getElementById('productModalTitle').textContent = p ? 'Edit product' : 'Add product';
  document.getElementById('pId').value = p ? p.id : '';
  document.getElementById('pName').value = p ? p.name : '';
  document.getElementById('pSku').value = p ? p.sku : '';
  document.getElementById('pCategory').value = p ? p.category : '';
  document.getElementById('pBrand').value = p ? p.brand : '';
  document.getElementById('pPrice').value = p ? p.price : '';
  document.getElementById('pOriginal').value = p && p.original ? p.original : '';
  document.getElementById('pStock').value = p ? p.stock : 0;
  document.getElementById('pLow').value = p ? p.lowStock : 5;
  document.getElementById('pDesc').value = p ? p.description : '';
  document.getElementById('deleteProductBtn').style.display = p ? 'inline-flex' : 'none';

  const rows = document.getElementById('imageRows');
  rows.innerHTML = '';
  const imgs = p && p.images && p.images.length ? p.images : [''];
  imgs.forEach(src => addImageRow(src));
  openModal('productModal');
}

async function uploadProductImages(input) {
  const files = Array.from(input.files || []);
  for (const f of files) {
    try {
      const dataUrl = await FSStore.fileToCompressedDataURL(f, 900, 0.7);
      addImageRow(dataUrl);
    } catch (e) { alert(e.message); }
  }
  input.value = '';
}

function collectImages() {
  return Array.from(document.querySelectorAll('#imageRows input'))
    .map(i => i.value.trim()).filter(Boolean);
}

async function saveProductForm(e) {
  e.preventDefault();
  const images = collectImages();
  if (!images.length) { alert('Please add at least one product image.'); return; }
  const idField = document.getElementById('pId').value;
  const product = {
    id: idField ? Number(idField) : Date.now(),
    name: document.getElementById('pName').value.trim(),
    sku: document.getElementById('pSku').value.trim(),
    category: document.getElementById('pCategory').value.trim(),
    brand: document.getElementById('pBrand').value.trim() || 'Fourstyle',
    price: Number(document.getElementById('pPrice').value),
    original: Number(document.getElementById('pOriginal').value) || 0,
    stock: Number(document.getElementById('pStock').value) || 0,
    lowStock: Number(document.getElementById('pLow').value) || 0,
    description: document.getElementById('pDesc').value.trim(),
    images
  };
  PRODUCTS = await FSStore.saveProduct(product);
  closeModal('productModal');
  renderInventory(); renderDashboard();
}

async function removeProduct(id) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p || !confirm('Delete "' + p.name + '" from the inventory?')) return;
  PRODUCTS = await FSStore.deleteProduct(id);
  renderInventory(); renderDashboard();
}
function deleteProductFromForm() {
  const id = document.getElementById('pId').value;
  if (!id) return;
  closeModal('productModal');
  removeProduct(Number(id));
}

/* =========================================================================
   EXCEL IMPORT / EXPORT
   ========================================================================= */
const IMPORT_COLUMNS = ['name', 'sku', 'price', 'original', 'category', 'brand', 'quantity',
                        'low_stock_alert', 'description', 'image1', 'image2', 'image3', 'image4', 'image5', 'image6'];

function openImport() {
  document.getElementById('importResult').innerHTML = '';
  document.getElementById('importFile').value = '';
  openModal('importModal');
}

function downloadTemplate() {
  const sample = PRODUCTS.slice(0, 3).map(p => ({
    name: p.name, sku: p.sku, price: p.price, original: p.original,
    category: p.category, brand: p.brand, quantity: p.stock, low_stock_alert: p.lowStock,
    description: p.description,
    image1: p.images[0] || '', image2: p.images[1] || '', image3: p.images[2] || '',
    image4: p.images[3] || '', image5: '', image6: ''
  }));
  if (!sample.length) sample.push(IMPORT_COLUMNS.reduce((o, c) => (o[c] = '', o), {}));
  const ws = XLSX.utils.json_to_sheet(sample, { header: IMPORT_COLUMNS });
  ws['!cols'] = IMPORT_COLUMNS.map(c => ({ wch: c.startsWith('image') ? 40 : c === 'description' ? 42 : 16 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
  XLSX.writeFile(wb, 'fourstyle-inventory-template.xlsx');
}

function runImport() {
  const file = document.getElementById('importFile').files[0];
  const out = document.getElementById('importResult');
  const mode = document.getElementById('importMode').value;
  if (!file) { out.className = 'import-result err'; out.textContent = 'Please choose an Excel or CSV file first.'; return; }

  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      if (!rows.length) throw new Error('The first sheet has no data rows.');

      const imported = rows.map((r, i) => {
        const get = (...keys) => {
          for (const k of keys) {
            const hit = Object.keys(r).find(h => h.toLowerCase().trim() === k);
            if (hit && r[hit] !== '') return r[hit];
          }
          return '';
        };
        const images = [];
        for (let n = 1; n <= 6; n++) {
          const v = get('image' + n, 'image ' + n);
          if (v) images.push(String(v).trim());
        }
        const main = get('image', 'main image');
        if (!images.length && main) images.push(String(main).trim());
        return {
          id: Number(get('id')) || 0,
          name: String(get('name', 'product', 'product name') || '').trim(),
          sku: String(get('sku', 'code') || '').trim(),
          price: Number(get('price', 'sale price')) || 0,
          original: Number(get('original', 'original price', 'mrp')) || 0,
          category: String(get('category') || 'other').trim(),
          brand: String(get('brand') || 'Fourstyle').trim(),
          stock: Number(get('quantity', 'stock', 'qty')) || 0,
          lowStock: Number(get('low_stock_alert', 'low stock alert', 'lowstock')) || 5,
          description: String(get('description') || '').trim(),
          images: images.length ? images : ['images/logo.jpeg']
        };
      }).filter(p => p.name);

      if (!imported.length) throw new Error('No rows with a product name were found. Check the "name" column.');

      let final;
      if (mode === 'replace') {
        final = imported.map((p, i) => Object.assign({}, p, { id: p.id || Date.now() + i }));
      } else {
        final = PRODUCTS.slice();
        imported.forEach((p, i) => {
          const match = final.find(x =>
            (p.id && x.id === p.id) ||
            (p.sku && x.sku && x.sku.toLowerCase() === p.sku.toLowerCase()) ||
            x.name.toLowerCase() === p.name.toLowerCase());
          if (match) Object.assign(match, p, { id: match.id });
          else final.push(Object.assign({}, p, { id: p.id || Date.now() + i }));
        });
      }

      PRODUCTS = await FSStore.saveProducts(final);
      out.className = 'import-result ok';
      out.innerHTML = '<i class="fas fa-check-circle"></i> Imported ' + imported.length +
        ' product row(s). Inventory now has ' + PRODUCTS.length + ' products.';
      renderInventory(); renderDashboard();
    } catch (err) {
      out.className = 'import-result err';
      out.textContent = 'Import failed: ' + err.message;
    }
  };
  reader.readAsArrayBuffer(file);
}

function saveSheet(rowsBySheet, fileName) {
  const wb = XLSX.utils.book_new();
  Object.keys(rowsBySheet).forEach(name => {
    const ws = XLSX.utils.json_to_sheet(rowsBySheet[name]);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  });
  XLSX.writeFile(wb, fileName);
}

function exportOrdersExcel() {
  const rows = visibleOrders().map(o => ({
    'Order ID': o.id, Date: o.date, Customer: o.name, Phone: o.phone, Email: o.email,
    Address: o.address, Items: (o.items || []).map(i => i.name + ' x' + i.qty).join('; '),
    Subtotal: o.subtotal || '', Delivery: o.delivery || '', Total: o.total,
    Payment: o.payment, 'Slip uploaded': o.slipUploaded ? 'Yes' : 'No', Status: o.status
  }));
  if (!rows.length) { alert('There are no orders to export.'); return; }
  saveSheet({ Orders: rows }, 'fourstyle-orders-' + dayKey(Date.now()) + '.xlsx');
}

function exportInventoryExcel() {
  const rows = PRODUCTS.map(p => ({
    name: p.name, sku: p.sku, price: p.price, original: p.original, category: p.category,
    brand: p.brand, quantity: p.stock, low_stock_alert: p.lowStock,
    status: p.stock <= 0 ? 'Out of stock' : p.stock <= p.lowStock ? 'Running out' : 'In stock',
    description: p.description,
    image1: p.images[0] || '', image2: p.images[1] || '', image3: p.images[2] || '',
    image4: p.images[3] || '', image5: p.images[4] || '', image6: p.images[5] || ''
  }));
  saveSheet({ Inventory: rows }, 'fourstyle-inventory-' + dayKey(Date.now()) + '.xlsx');
}

/* =========================================================================
   REPORTS — daily + monthly chart, both exportable
   ========================================================================= */
function groupSales(keyFn) {
  const map = {};
  ORDERS.forEach(o => {
    const k = keyFn(o.timestamp);
    if (!map[k]) map[k] = { key: k, orders: 0, units: 0, sales: 0, confirmed: 0 };
    map[k].orders += 1;
    map[k].sales += Number(o.total) || 0;
    map[k].units += (o.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
    if (['Confirmed', 'Shipped', 'Delivered'].includes(o.status)) map[k].confirmed += 1;
  });
  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
}

function lastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(dayKey(d.getTime()));
  }
  return out;
}

function setReportMode(mode) {
  reportMode = mode;
  document.querySelectorAll('#reportToggle button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('dailyReport').style.display = mode === 'daily' ? 'block' : 'none';
  document.getElementById('monthlyReport').style.display = mode === 'monthly' ? 'block' : 'none';
  renderReports();
}

function renderReports() {
  if (typeof Chart === 'undefined') return;
  const daily = groupSales(dayKey);
  const dailyMap = {};
  daily.forEach(d => (dailyMap[d.key] = d));
  const days = lastNDays(30);
  const today = dayKey(Date.now());
  const yKey = dayKey(Date.now() - 86400000);
  const t = dailyMap[today] || { orders: 0, sales: 0, units: 0 };
  const y = dailyMap[yKey] || { sales: 0 };

  document.getElementById('todayOrders').textContent = t.orders;
  document.getElementById('todaySales').textContent = Number(t.sales).toLocaleString('en-PK');
  document.getElementById('todayUnits').textContent = t.units;
  document.getElementById('yesterdaySales').textContent = Number(y.sales).toLocaleString('en-PK');

  document.getElementById('dailyBody').innerHTML = daily.length
    ? daily.slice().reverse().map(d => `<tr>
        <td>${d.key}</td><td>${d.orders}</td><td>${d.units}</td><td>${rs(d.sales)}</td><td>${d.confirmed}</td></tr>`).join('')
    : '<tr class="empty-row"><td colspan="5">No sales recorded yet.</td></tr>';

  const gold = '#c9a227';
  if (reportMode === 'daily') {
    const data = days.map(k => (dailyMap[k] ? dailyMap[k].sales : 0));
    if (dailyChart) dailyChart.destroy();
    dailyChart = new Chart(document.getElementById('dailyChart'), {
      type: 'bar',
      data: {
        labels: days.map(k => k.slice(5)),
        datasets: [{ label: 'Sales (Rs)', data, backgroundColor: gold, borderRadius: 5, maxBarThickness: 26 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: 'Daily sales — last 30 days' } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => 'Rs ' + Number(v).toLocaleString('en-PK') } } }
      }
    });
  }

  const monthly = groupSales(monthKey);
  const mOrders = monthly.length ? monthly[monthly.length - 1] : { orders: 0, sales: 0 };
  const thisMonth = monthly.find(m => m.key === monthKey(Date.now())) || { orders: 0, sales: 0, units: 0 };
  const best = monthly.slice().sort((a, b) => b.sales - a.sales)[0];
  document.getElementById('monthOrders').textContent = thisMonth.orders;
  document.getElementById('monthSales').textContent = Number(thisMonth.sales).toLocaleString('en-PK');
  document.getElementById('monthAvg').textContent = thisMonth.orders
    ? Math.round(thisMonth.sales / thisMonth.orders).toLocaleString('en-PK') : '0';
  document.getElementById('bestMonth').textContent = best ? monthLabel(best.key) : '—';

  document.getElementById('monthlyBody').innerHTML = monthly.length
    ? monthly.slice().reverse().map(m => `<tr>
        <td>${monthLabel(m.key)}</td><td>${m.orders}</td><td>${m.units}</td><td>${rs(m.sales)}</td></tr>`).join('')
    : '<tr class="empty-row"><td colspan="4">No sales recorded yet.</td></tr>';

  if (reportMode === 'monthly') {
    if (monthlyChart) monthlyChart.destroy();
    monthlyChart = new Chart(document.getElementById('monthlyChart'), {
      type: 'line',
      data: {
        labels: monthly.map(m => monthLabel(m.key)),
        datasets: [
          { label: 'Sales (Rs)', data: monthly.map(m => m.sales), type: 'bar', borderColor: gold,
            backgroundColor: gold, borderRadius: 5, maxBarThickness: 34, yAxisID: 'y' },
          { label: 'Orders', data: monthly.map(m => m.orders), borderColor: '#2563eb',
            backgroundColor: '#2563eb', tension: .32, pointRadius: 4, borderWidth: 2, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Monthly sales report' } },
        scales: {
          y: { beginAtZero: true, position: 'left', ticks: { callback: v => 'Rs ' + Number(v).toLocaleString('en-PK') } },
          y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Orders' } }
        }
      }
    });
  }
}

function exportReportExcel() {
  const daily = groupSales(dayKey).map(d => ({
    Date: d.key, Orders: d.orders, Units: d.units, 'Sales (Rs)': d.sales, Confirmed: d.confirmed
  }));
  const monthly = groupSales(monthKey).map(m => ({
    Month: monthLabel(m.key), Orders: m.orders, Units: m.units, 'Sales (Rs)': m.sales, Confirmed: m.confirmed
  }));
  if (!daily.length) { alert('There are no sales to export yet.'); return; }
  saveSheet({ 'Daily report': daily, 'Monthly report': monthly },
    'fourstyle-sales-report-' + dayKey(Date.now()) + '.xlsx');
}

/* =========================================================================
   MESSAGES
   ========================================================================= */
function renderMessages() {
  const q = (document.getElementById('msgSearch').value || '').toLowerCase().trim();
  const list = MESSAGES.filter(m => !q ||
    String(m.email || '').toLowerCase().includes(q) ||
    String(m.whatsapp || '').toLowerCase().includes(q) ||
    String(m.question || '').toLowerCase().includes(q));

  document.getElementById('messagesBody').innerHTML = list.length ? list.map(m => `
    <div class="msg-card ${m.status === 'New' ? 'new' : ''}">
      <div class="msg-head">
        <strong>${esc(m.email || 'No email')}</strong>
        ${statusBadge(m.status === 'New' ? 'Pending' : m.status)}
        <span class="badge slip">${esc(m.type || 'Contact form')}</span>
        <span class="when">${esc(m.date)}</span>
      </div>
      <div class="msg-body">${esc(m.question)}</div>
      <div class="msg-meta">
        <span><i class="fab fa-whatsapp"></i> ${esc(m.whatsapp || '—')}</span>
        <span><i class="fas fa-location-dot"></i> ${esc(m.address || '—')}</span>
      </div>
      <div class="msg-actions">
        ${m.whatsapp ? `<a class="btn btn-outline btn-sm" target="_blank" href="https://wa.me/${String(m.whatsapp).replace(/\D/g, '').replace(/^0/, '92')}"><i class="fab fa-whatsapp"></i> Reply on WhatsApp</a>` : ''}
        ${m.email ? `<a class="btn btn-outline btn-sm" href="mailto:${esc(m.email)}"><i class="fas fa-envelope"></i> Reply by email</a>` : ''}
        <button class="btn btn-success btn-sm" onclick="markMessage('${m.id}')"><i class="fas fa-check"></i> Mark answered</button>
        <button class="btn btn-danger btn-sm" onclick="removeMessage('${m.id}')"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>`).join('')
    : '<p style="color:var(--muted);font-size:13px;">No messages yet. Questions sent from the Contact Us page appear here.</p>';
}
async function markMessage(id) {
  await FSStore.updateMessage(id, { status: 'Answered' });
  const m = MESSAGES.find(x => x.id === id);
  if (m) m.status = 'Answered';
  renderMessages(); updatePills();
}
async function removeMessage(id) {
  if (!confirm('Delete this message?')) return;
  await FSStore.deleteMessage(id);
  MESSAGES = MESSAGES.filter(m => m.id !== id);
  renderMessages(); updatePills();
}

/* ------------------------------------------------------------------- expose */
Object.assign(window, {
  logout, showSection, openSidebar, closeSidebar, openModal, closeModal, refreshAll,
  setOrderFilter, renderOrders, viewOrder, setStatus, removeOrder,
  renderSlips, viewSlip, setSlipStatus, removeSlip,
  renderInventory, openProductForm, addImageRow, uploadProductImages, saveProductForm,
  removeProduct, deleteProductFromForm,
  openImport, downloadTemplate, runImport, exportOrdersExcel, exportInventoryExcel,
  setReportMode, exportReportExcel, renderMessages, markMessage, removeMessage
});

document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('active'); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
});

refreshAll();
