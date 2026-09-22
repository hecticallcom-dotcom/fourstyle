/* ===== FOURSTYLE — Shop Script ============================================ */

const PAYMENT_ACCOUNTS = {
  wallet: { number: '0344 1514744', raw: '03441514744', name: 'Muhammad Ramzan' },
  bank:   { title: 'Muhammad Ramzan', number: '1611534361014057' }
};
const DELIVERY_CHARGES = 250;
const WHATSAPP_NUMBER = '923110199257';

let products = [];
let filteredProducts = [];
let displayedProducts = 12;
let activeFilter = { type: 'all', value: 'all', label: 'All Products' };
let lastOrder = null;

/* ---------- cart storage (per logged-in user / per guest browser) ---------- */
function getSession() {
  try { return JSON.parse(FSLS.getItem('fourstyle_session') || 'null'); }
  catch (e) { return null; }
}
function getCartKey() {
  const session = getSession();
  if (session && session.email) {
    return 'fourstyle_cart_' + session.email.toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
  }
  let guestId = FSLS.getItem('fourstyle_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    FSLS.setItem('fourstyle_guest_id', guestId);
  }
  return 'fourstyle_cart_' + guestId;
}
let cart = JSON.parse(FSLS.getItem(getCartKey()) || '[]');
try { FSLS.removeItem('fourstyle_cart'); } catch (e) {}

/* ---------- DOM ---------- */
const productGrid   = document.getElementById('productGrid');
const cartBtn       = document.getElementById('cartBtn');
const closeCart     = document.getElementById('closeCart');
const cartOverlay   = document.getElementById('cartOverlay');
const cartSidebar   = document.getElementById('cartSidebar');
const cartBody      = document.getElementById('cartBody');
const cartFooter    = document.getElementById('cartFooter');
const cartCount     = document.getElementById('cartCount');
const cartSubtotal  = document.getElementById('cartSubtotal');
const loadMoreBtn   = document.getElementById('loadMoreBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav     = document.getElementById('mobileNav');
const sortSelect    = document.getElementById('sortSelect');
const filterNotice  = document.getElementById('filterNotice');
const resultCount   = document.getElementById('resultCount');

const money = n => 'Rs.' + Number(n || 0).toLocaleString('en-PK');

/* ---------- modal helpers (never leave the page unscrollable) ---------- */
function lockScroll()   { document.body.classList.add('no-scroll'); }
function unlockScroll() {
  const stillOpen = document.querySelector('.modal-overlay.active, .cart-sidebar.active');
  if (!stillOpen) document.body.classList.remove('no-scroll');
}

/* =========================================================================
   FILTERING — by category, by brand, by search
   ========================================================================= */
function applyFilter() {
  const { type, value } = activeFilter;
  if (type === 'category') {
    filteredProducts = products.filter(p => p.category === value);
  } else if (type === 'brand') {
    filteredProducts = products.filter(p => (p.brand || '').toLowerCase() === String(value).toLowerCase());
  } else if (type === 'search') {
    const q = String(value).toLowerCase();
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q));
  } else {
    filteredProducts = products.slice();
  }
  displayedProducts = 12;
  renderProducts();
  renderFilterNotice();
}

function filterCategory(category, label) {
  const meta = (window.CATEGORY_LIST || []).find(c => c.slug === category);
  activeFilter = { type: 'category', value: category, label: label || (meta ? meta.label : category) };
  applyFilter();
  scrollToProducts();
}
function filterBrand(brand) {
  activeFilter = { type: 'brand', value: brand, label: brand };
  applyFilter();
  scrollToProducts();
}
function filterSearch(query) {
  activeFilter = { type: 'search', value: query, label: '“' + query + '”' };
  applyFilter();
  scrollToProducts();
}
function clearFilter() {
  activeFilter = { type: 'all', value: 'all', label: 'All Products' };
  applyFilter();
  scrollToProducts();
}
function scrollToProducts() {
  const section = document.getElementById('products');
  if (!section) return;
  const header = document.getElementById('header');
  const offset = header ? header.offsetHeight + 8 : 0;
  const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function renderFilterNotice() {
  const title = document.getElementById('productsTitle');
  if (title) title.textContent = activeFilter.type === 'all' ? 'All Products' : activeFilter.label;
  if (resultCount) {
    const n = filteredProducts.length;
    resultCount.textContent = n + (n === 1 ? ' product' : ' products');
  }
  if (!filterNotice) return;
  if (activeFilter.type === 'all') { filterNotice.innerHTML = ''; filterNotice.classList.remove('active'); return; }
  const kind = activeFilter.type === 'brand' ? 'Brand' : activeFilter.type === 'category' ? 'Category' : 'Search';
  filterNotice.classList.add('active');
  filterNotice.innerHTML =
    '<span class="filter-chip">' + kind + ': <strong>' + activeFilter.label + '</strong>' +
    '<button type="button" onclick="clearFilter()" aria-label="Clear filter">&times;</button></span>' +
    '<button type="button" class="filter-clear" onclick="clearFilter()">Show all products</button>';
}

/* =========================================================================
   PRODUCT CARDS — equal height, Add to Cart always in the same place,
   thumbnails that swap the main image
   ========================================================================= */
function cardThumbs(p) {
  if (!p.images || p.images.length < 2) return '';
  const thumbs = p.images.slice(0, 6).map((src, i) =>
    '<button type="button" class="card-thumb' + (i === 0 ? ' active' : '') +
    '" data-src="' + src + '" aria-label="View image ' + (i + 1) + ' of ' + p.name + '">' +
    '<img src="' + src + '" alt="" loading="lazy"></button>').join('');
  return '<div class="card-thumbs" data-id="' + p.id + '">' + thumbs + '</div>';
}

function stockLine(p) {
  if (p.stock <= 0) return '<span class="stock-tag out">Out of stock</span>';
  if (p.stock <= p.lowStock) return '<span class="stock-tag low">Only ' + p.stock + ' left</span>';
  return '<span class="stock-tag in">In stock</span>';
}

function renderProducts() {
  if (!productGrid) return;
  const list = filteredProducts;
  const toShow = list.slice(0, displayedProducts);

  if (!toShow.length) {
    productGrid.innerHTML =
      '<div class="empty-state">' +
      '<i class="fas fa-box-open"></i>' +
      '<h3>No products found</h3>' +
      '<p>Nothing here yet for ' + activeFilter.label + '.</p>' +
      '<button class="btn btn-primary" onclick="clearFilter()">Show all products</button>' +
      '</div>';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  productGrid.innerHTML = toShow.map(p => `
    <article class="product-card" data-id="${p.id}">
      ${p.discount ? `<span class="product-badge">-${p.discount}%</span>` : ''}
      <div class="product-media">
        <div class="product-img" onclick="openProductModal(${p.id})">
          <img src="${p.image}" alt="${p.name}" class="card-main-img" data-id="${p.id}" loading="lazy">
          <span class="quick-view-overlay"><i class="fas fa-search-plus"></i> Quick View</span>
        </div>
        ${cardThumbs(p)}
      </div>
      <div class="product-info">
        <span class="product-brand">${p.brand || 'Fourstyle'}</span>
        <h3 onclick="openProductModal(${p.id})">${p.name}</h3>
        ${stockLine(p)}
        <div class="product-actions">
          <button class="price-btn" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}
                  aria-label="Buy ${p.name} for ${money(p.price)}">
            <span class="price-btn-main">${money(p.price)}</span>
            ${p.original > p.price ? `<span class="price-btn-old">${money(p.original)}</span>` : ''}
            <span class="price-btn-cta">${p.stock <= 0 ? 'Sold out' : 'Buy now'}</span>
          </button>
          <button class="btn btn-primary add-to-cart" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
        </div>
      </div>
    </article>`).join('');

  productGrid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); addToCart(Number(btn.dataset.id)); });
  });
  // Price button = working buy button
  productGrid.querySelectorAll('.price-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); addToCart(Number(btn.dataset.id)); });
  });
  // Thumbnail click swaps the card's main image
  productGrid.querySelectorAll('.card-thumbs').forEach(box => {
    box.addEventListener('click', e => {
      const thumb = e.target.closest('.card-thumb');
      if (!thumb) return;
      e.stopPropagation();
      const id = box.dataset.id;
      const main = productGrid.querySelector('.card-main-img[data-id="' + id + '"]');
      if (main) main.src = thumb.dataset.src;
      box.querySelectorAll('.card-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  if (loadMoreBtn) loadMoreBtn.style.display = displayedProducts >= list.length ? 'none' : 'inline-flex';
}

/* ---------- category strip + nav menus built from the live catalogue ---------- */
function renderCategoryStrip() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = (window.CATEGORY_LIST || []).map(c => {
    const items = products.filter(p => p.category === c.slug);
    const img = items[0] ? items[0].image : 'images/logo.jpeg';
    return `<button type="button" class="category-card" onclick="filterCategory('${c.slug}')">
        <span class="category-img"><img src="${img}" alt="${c.label}" loading="lazy"></span>
        <h3>${c.label}</h3>
        <span class="category-count">${items.length} Product${items.length === 1 ? '' : 's'}</span>
      </button>`;
  }).join('');
}

function renderMenus() {
  const cats = window.CATEGORY_LIST || [];
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const catMenu = document.getElementById('categoryMenu');
  if (catMenu) catMenu.innerHTML = cats.map(c =>
    `<li><a href="#products" onclick="filterCategory('${c.slug}'); return false;">${c.label}</a></li>`).join('');

  const brandMenu = document.getElementById('brandMenu');
  if (brandMenu) brandMenu.innerHTML = brands.map(b =>
    `<li><a href="#products" onclick="filterBrand('${b.replace(/'/g, "\\'")}'); return false;">${b}</a></li>`).join('');

  const mobileCats = document.getElementById('mobileCategories');
  if (mobileCats) mobileCats.innerHTML =
    cats.map(c => `<li><a href="#products" onclick="filterCategory('${c.slug}'); closeMobileNav(); return false;">${c.label}</a></li>`).join('');

  const mobileBrands = document.getElementById('mobileBrands');
  if (mobileBrands) mobileBrands.innerHTML =
    brands.map(b => `<li><a href="#products" onclick="filterBrand('${b.replace(/'/g, "\\'")}'); closeMobileNav(); return false;">${b}</a></li>`).join('');
}

/* =========================================================================
   QUICK VIEW MODAL — gallery with as many angles as the product has
   ========================================================================= */
function openProductModal(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;
  const imgs = product.images && product.images.length ? product.images : [product.image];

  const modal = document.getElementById('productModal');
  const mainImg = document.getElementById('modalMainImg');
  const thumbs = document.getElementById('modalThumbs');

  mainImg.src = imgs[0];
  mainImg.alt = product.name;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalBrand').textContent = product.brand || 'Fourstyle';
  document.getElementById('modalPrice').textContent = money(product.price);
  document.getElementById('modalOriginal').textContent = product.original > product.price ? money(product.original) : '';
  const badge = document.getElementById('modalBadge');
  badge.textContent = product.discount ? '-' + product.discount + '%' : '';
  badge.style.display = product.discount ? 'inline-block' : 'none';
  document.getElementById('modalDesc').textContent =
    product.description || 'Premium quality fashion accessory. Free gift on any 2 items. Cash on Delivery available nationwide.';
  document.getElementById('modalStock').innerHTML = stockLine(product);

  thumbs.innerHTML = imgs.map((src, i) =>
    `<button type="button" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
       <img src="${src}" alt="View ${i + 1} of ${product.name}"></button>`).join('');
  thumbs.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = imgs[Number(thumb.dataset.index)];
      thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  const addBtn = document.getElementById('modalAddToCart');
  addBtn.disabled = product.stock <= 0;
  addBtn.textContent = product.stock <= 0 ? 'Out of stock' : 'Add to Cart — ' + money(product.price);
  addBtn.onclick = () => { addToCart(product.id); closeProductModal(); };

  modal.classList.add('active');
  lockScroll();
}
function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  unlockScroll();
}

/* =========================================================================
   SEARCH
   ========================================================================= */
function openSearch() {
  const modal = document.getElementById('searchModal');
  if (!modal) return;
  modal.classList.add('active');
  lockScroll();
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
    input.focus();
    document.getElementById('searchResults').innerHTML = '<p class="search-hint">Type to search products…</p>';
  }
}
function closeSearch() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.classList.remove('active');
  unlockScroll();
}
function doSearch(query) {
  const results = document.getElementById('searchResults');
  if (!results) return;
  const q = (query || '').trim().toLowerCase();
  if (!q) { results.innerHTML = '<p class="search-hint">Type to search products…</p>'; return; }
  const matches = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.brand || '').toLowerCase().includes(q) ||
    (p.category || '').toLowerCase().includes(q));
  if (!matches.length) { results.innerHTML = '<p class="search-hint">No products found.</p>'; return; }
  results.innerHTML = matches.slice(0, 12).map(p => `
    <button type="button" class="search-item" onclick="closeSearch(); openProductModal(${p.id})">
      <img src="${p.image}" alt="${p.name}">
      <span><strong>${p.name}</strong><span>${money(p.price)} · ${p.brand}</span></span>
    </button>`).join('') +
    `<button type="button" class="btn btn-outline btn-block" style="margin-top:12px"
       onclick="closeSearch(); filterSearch('${q.replace(/'/g, "")}')">See all results in shop</button>`;
}

/* =========================================================================
   CART
   ========================================================================= */
function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;
  if (product.stock <= 0) { toast('This item is out of stock.'); return; }
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, sku: product.sku, qty: 1 });
  saveCart();
  updateCartUI();
  openCart();
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== Number(id)); saveCart(); updateCartUI(); }
function updateQty(id, change) {
  const item = cart.find(i => i.id === Number(id));
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}
function saveCart() { FSLS.setItem(getCartKey(), JSON.stringify(cart)); }
function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  if (cartCount) cartCount.textContent = totalItems;
  if (!cartBody) return;

  if (!cart.length) {
    cartBody.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is currently empty.</p></div>';
    if (cartFooter) { cartFooter.style.display = 'none'; cartFooter.innerHTML = ''; }
    return;
  }

  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="price">${money(item.price)}</div>
        <div class="cart-item-qty">
          <button onclick="updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Remove"><i class="fas fa-trash"></i></button>
    </div>`).join('');

  if (!cartFooter) return;
  const session = getSession();
  const loggedIn = session && session.email;
  let html = `<div class="cart-subtotal"><span>Subtotal</span><strong>${money(cartTotal())}</strong></div>`;
  if (loggedIn) {
    html += `<button class="btn btn-primary btn-block" onclick="openCheckout()">Checkout</button>`;
  } else {
    html += `<div class="cart-note"><strong>Note:</strong> Please <a href="login.html">login or sign up</a> to order online,
             or send your order straight to us on WhatsApp.</div>`;
  }
  html += `<button class="btn btn-whatsapp btn-block" onclick="orderViaWhatsApp()"><i class="fab fa-whatsapp"></i> Order via WhatsApp</button>
           <button type="button" class="view-cart-link" onclick="closeCartSidebar()">Continue shopping</button>`;
  cartFooter.innerHTML = html;
  cartFooter.style.display = 'block';
}

function openCart() {
  if (cartSidebar) cartSidebar.classList.add('active');
  if (cartOverlay) cartOverlay.classList.add('active');
  lockScroll();
}
function closeCartSidebar() {
  if (cartSidebar) cartSidebar.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
  unlockScroll();
}

/* =========================================================================
   CHECKOUT + PAYMENT
   ========================================================================= */
function openCheckout() {
  if (!cart.length) { toast('Your cart is empty.'); return; }
  const session = getSession();
  if (!session || !session.email) {
    toast('Please login or sign up before placing an online order.');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }
  closeCartSidebar();

  const subtotal = cartTotal();
  const total = subtotal + DELIVERY_CHARGES;

  document.getElementById('checkoutItems').innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}">
      <div><strong>${item.name}</strong><p>Qty ${item.qty} × ${money(item.price)}</p></div>
      <span>${money(item.price * item.qty)}</span>
    </div>`).join('');

  document.getElementById('checkoutTotal').innerHTML = `
    <div class="total-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="total-row"><span>Delivery charges</span><span>${money(DELIVERY_CHARGES)}</span></div>
    <div class="total-row grand"><span>Total payable</span><span>${money(total)}</span></div>`;

  const form = document.getElementById('checkoutForm');
  if (form && session) {
    if (!form.name.value) form.name.value = session.name || '';
    if (!form.email.value) form.email.value = session.email || '';
  }
  document.getElementById('slipStep').style.display = 'none';
  document.getElementById('checkoutForm').style.display = 'block';
  togglePaymentFields();
  document.getElementById('checkoutModal').classList.add('active');
  lockScroll();
}
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
  unlockScroll();
}

function togglePaymentFields() {
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  document.querySelectorAll('.payment-option').forEach(o =>
    o.classList.toggle('selected', o.querySelector('input').checked));
  const wallet = document.getElementById('walletDetails');
  const bank = document.getElementById('bankDetails');
  const advance = document.getElementById('advanceNote');
  const isWallet = payment === 'JazzCash / EasyPaisa';
  const isBank = payment === 'Bank Transfer';
  wallet.style.display = isWallet ? 'block' : 'none';
  bank.style.display = isBank ? 'block' : 'none';
  advance.style.display = payment === 'Cash on Delivery' ? 'block' : 'none';
}

function copyText(text, btn) {
  const done = () => {
    if (!btn) return;
    const old = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
    setTimeout(() => { btn.innerHTML = old; }, 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); done();
  }
}

async function placeOrder(e) {
  e.preventDefault();
  const form = document.getElementById('checkoutForm');
  const submitBtn = form.querySelector('.place-order-btn');
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    notes: form.notes.value.trim()
  };
  const payment = form.querySelector('input[name="payment"]:checked')?.value;
  if (!data.name || !data.email || !data.phone || !data.address || !payment) {
    toast('Please fill in every required field.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing order…';

  const orderId = 'FS' + Date.now();
  const order = {
    id: orderId,
    date: new Date().toLocaleString('en-PK'),
    timestamp: Date.now(),
    ...data,
    payment,
    paymentAccount: payment === 'Bank Transfer' ? PAYMENT_ACCOUNTS.bank
                  : payment === 'JazzCash / EasyPaisa' ? PAYMENT_ACCOUNTS.wallet : null,
    items: cart.map(i => ({ id: i.id, sku: i.sku, name: i.name, price: i.price, qty: i.qty, image: i.image })),
    subtotal: cartTotal(),
    delivery: DELIVERY_CHARGES,
    total: cartTotal() + DELIVERY_CHARGES,
    slipUploaded: false,
    status: 'Pending'
  };

  try { await FSStore.saveOrder(order); } catch (err) { console.warn(err); }
  try { await FSStore.decrementStock(order.items); } catch (err) {}

  lastOrder = order;
  cart = [];
  saveCart();
  updateCartUI();
  products = await FSStore.getProducts();
  applyFilter();

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';

  // Move to the payment-slip step inside the same modal
  form.style.display = 'none';
  const step = document.getElementById('slipStep');
  step.style.display = 'block';
  document.getElementById('slipOrderId').textContent = orderId;
  document.getElementById('slipOrderTotal').textContent = money(order.total);
  const needsSlip = payment !== 'Cash on Delivery';
  document.getElementById('slipUploadBlock').style.display = needsSlip ? 'block' : 'none';
  document.getElementById('slipCodNote').style.display = needsSlip ? 'none' : 'block';
  document.getElementById('slipResult').innerHTML = '';
  document.getElementById('slipPreview').innerHTML = '';
  const input = document.getElementById('slipFile');
  if (input) input.value = '';
}

/* ---------- payment slip upload ---------- */
function previewSlip(input) {
  const box = document.getElementById('slipPreview');
  const file = input.files && input.files[0];
  if (!file) { box.innerHTML = ''; return; }
  FSStore.fileToCompressedDataURL(file, 1100, 0.7)
    .then(dataUrl => {
      box.innerHTML = file.type === 'application/pdf'
        ? '<p class="slip-file"><i class="fas fa-file-pdf"></i> ' + file.name + '</p>'
        : '<img src="' + dataUrl + '" alt="Payment slip preview">';
      box.dataset.dataUrl = dataUrl;
      box.dataset.fileName = file.name;
    })
    .catch(err => { box.innerHTML = '<p class="slip-error">' + err.message + '</p>'; });
}

async function uploadSlip() {
  const box = document.getElementById('slipPreview');
  const result = document.getElementById('slipResult');
  const btn = document.getElementById('slipUploadBtn');
  if (!box.dataset.dataUrl) {
    result.innerHTML = '<div class="slip-error">Please choose your payment slip image first.</div>';
    return;
  }
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading…';

  const slip = {
    orderId: lastOrder ? lastOrder.id : 'N/A',
    customer: lastOrder ? lastOrder.name : '',
    phone: lastOrder ? lastOrder.phone : '',
    email: lastOrder ? lastOrder.email : '',
    amount: lastOrder ? lastOrder.total : 0,
    payment: lastOrder ? lastOrder.payment : '',
    fileName: box.dataset.fileName || 'slip.jpg',
    image: box.dataset.dataUrl,
    date: new Date().toLocaleString('en-PK'),
    timestamp: Date.now(),
    status: 'Pending review'
  };

  try {
    await FSStore.saveSlip(slip);
    if (lastOrder) await FSStore.updateOrder(lastOrder.id, { slipUploaded: true, status: 'Payment slip received' });
    result.innerHTML =
      '<div class="slip-success"><i class="fas fa-check-circle"></i>' +
      '<div><strong>Your payment slip has been uploaded successfully.</strong>' +
      '<p>Our team will verify it and confirm your order shortly. Order ID: ' + slip.orderId + '</p></div></div>';
    btn.style.display = 'none';
  } catch (err) {
    result.innerHTML = '<div class="slip-error">Upload failed. Please send the slip on WhatsApp instead.</div>';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Upload payment slip';
  }
}

function finishCheckout() {
  closeCheckout();
  const form = document.getElementById('checkoutForm');
  if (form) { form.reset(); form.style.display = 'block'; }
  document.getElementById('slipStep').style.display = 'none';
}

function orderViaWhatsApp() {
  if (!cart.length) { toast('Your cart is empty.'); return; }
  const lines = cart.map(i => `• ${i.name} x${i.qty} = ${money(i.price * i.qty)}`);
  const total = cartTotal() + DELIVERY_CHARGES;
  const msg = encodeURIComponent(
    `Assalam o Alaikum Fourstyle!\n\nI would like to order:\n\n${lines.join('\n')}\n\nDelivery: ${money(DELIVERY_CHARGES)}\n*Total: ${money(total)}*\n\nName: \nPhone: \nAddress: `);
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg, '_blank');
}

/* =========================================================================
   SMALL UI BITS
   ========================================================================= */
function toast(message) {
  let el = document.getElementById('fsToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fsToast';
    el.className = 'fs-toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2800);
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('active');
  const icon = mobileMenuBtn && mobileMenuBtn.querySelector('i');
  if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
}

function renderAccountLink() {
  const session = getSession();
  const link = document.getElementById('authBtn');
  if (!link) return;
  if (session && session.email) {
    link.title = 'Logged in as ' + (session.name || session.email);
    link.classList.add('logged-in');
    link.href = session.role === 'admin' ? 'admin.html' : '#';
    if (session.role !== 'admin') {
      link.onclick = e => {
        e.preventDefault();
        if (confirm('Logged in as ' + (session.name || session.email) + '\n\nLog out now?')) {
          FSLS.removeItem('fourstyle_session');
          location.reload();
        }
      };
    }
  }
}

/* =========================================================================
   EVENTS
   ========================================================================= */
if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);
if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => { displayedProducts += 8; renderProducts(); });

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
}

document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value.trim();
    try {
      await FSStore.saveMessage({
        type: 'Newsletter', email, whatsapp: '', address: '',
        question: 'Newsletter subscription request',
        date: new Date().toLocaleString('en-PK'), timestamp: Date.now(), status: 'New'
      });
    } catch (err) {}
    toast('Thank you for subscribing. Your 10% discount code will be emailed to you.');
    newsletterForm.reset();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', e => {
    const v = e.target.value;
    if (v === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
    else if (v === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
    else if (v === 'best') filteredProducts.sort((a, b) => b.discount - a.discount);
    else if (v === 'new') filteredProducts.sort((a, b) => b.id - a.id);
    else filteredProducts.sort((a, b) => a.id - b.id);
    displayedProducts = 12;
    renderProducts();
  });
}

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 40);
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', e => doSearch(e.target.value));
  searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeSearch();
  if (document.getElementById('productModal')?.classList.contains('active')) closeProductModal();
  closeCartSidebar();
});

/* =========================================================================
   INIT
   ========================================================================= */
async function initShop() {
  renderAccountLink();
  updateCartUI();
  try { products = await FSStore.getProducts(); }
  catch (e) { products = (window.SEED_PRODUCTS || []).slice(); }
  filteredProducts = products.slice();
  renderMenus();
  renderCategoryStrip();
  applyFilter();
  FSStore.trackVisit();

  // Deep links: index.html#products?category=watches  /  ?brand=Rolex%20Style
  const params = new URLSearchParams(location.search);
  if (params.get('category')) filterCategory(params.get('category'));
  else if (params.get('brand')) filterBrand(params.get('brand'));
}

/* expose for inline handlers */
Object.assign(window, {
  addToCart, removeFromCart, updateQty, openProductModal, closeProductModal,
  openCart, closeCartSidebar, openCheckout, closeCheckout, placeOrder,
  togglePaymentFields, copyText, previewSlip, uploadSlip, finishCheckout,
  orderViaWhatsApp, filterCategory, filterBrand, filterSearch, clearFilter,
  openSearch, closeSearch, doSearch, closeMobileNav, toast
});

if (productGrid) initShop();

/* If a product image URL is unreachable, fall back to the logo instead of an
   empty grey box. Captured globally so it covers every rendered image. */
document.addEventListener('error', function (e) {
  const t = e.target;
  if (t && t.tagName === 'IMG' && !t.dataset.fbApplied && !/^data:/.test(t.src)) {
    t.dataset.fbApplied = '1';
    t.src = 'images/logo.jpeg';
    t.classList.add('img-fallback');
  }
}, true);
