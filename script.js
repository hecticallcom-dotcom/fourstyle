// ===== FOURSTYLE E-Commerce Script =====

// Product Data with multiple images for gallery
const products = [
  {
    id: 1,
    name: "Hublot Diamond Cut Heavy Watch",
    price: 2999,
    original: 3850,
    discount: 22,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 2,
    name: "Tissot PRX 1853",
    price: 2999,
    original: 3850,
    discount: 22,
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-f977d8b8c1d5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509048191080-d2984aad5a5d?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 3,
    name: "Rolex Jubilee Chain Semi Automatic",
    price: 3450,
    original: 4450,
    discount: 22,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609587312208-ceaaccedd242?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 4,
    name: "Cartier Tank",
    price: 2499,
    original: 3850,
    discount: 35,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 5,
    name: "Tissot 1853 Chronograph",
    price: 3850,
    original: 4550,
    discount: 15,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-f977d8b8c1d5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509048191080-d2984aad5a5d?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 6,
    name: "Rolex Oyster Semi Auto",
    price: 3550,
    original: 4250,
    discount: 16,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609587312208-ceaaccedd242?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 7,
    name: "Patek Philippe Geneve",
    price: 2999,
    original: 3850,
    discount: 22,
    image: "https://images.unsplash.com/photo-1509048191080-d2984aad5a5d?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509048191080-d2984aad5a5d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 8,
    name: "Rolex Oyster Datejust Truetone",
    price: 2999,
    original: 3850,
    discount: 22,
    image: "https://images.unsplash.com/photo-1609587312208-ceaaccedd242?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609587312208-ceaaccedd242?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 9,
    name: "Rolex Automatic",
    price: 5999,
    original: 7999,
    discount: 25,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609587312208-ceaaccedd242?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 10,
    name: "Rolex GMT Master Semi Automatic",
    price: 3550,
    original: 4850,
    discount: 26,
    image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609587312208-ceaaccedd242?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 11,
    name: "Hublot Strap Classic",
    price: 2150,
    original: 2850,
    discount: 24,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 12,
    name: "Tissot PRX Semi Automatic",
    price: 3350,
    original: 4250,
    discount: 21,
    image: "https://images.unsplash.com/photo-1617043786394-f977d8b8c1d5?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617043786394-f977d8b8c1d5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509048191080-d2984aad5a5d?w=600&h=600&fit=crop"
    ],
    category: "watches"
  },
  {
    id: 13,
    name: "Premium Black Cap",
    price: 999,
    original: 1499,
    discount: 33,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop"
    ],
    category: "caps"
  },
  {
    id: 14,
    name: "Classic Aviator Sunglasses",
    price: 1299,
    original: 1999,
    discount: 35,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1577803645773-f96470509667?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop"
    ],
    category: "glasses"
  },
  {
    id: 15,
    name: "Leather Wallet Brown",
    price: 1499,
    original: 2199,
    discount: 32,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606503825008-909a67e3137e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"
    ],
    category: "wallets"
  },
  {
    id: 16,
    name: "Al Salah Dual Time Watch",
    price: 3999,
    original: 5000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop"
    ],
    category: "watches"
  }
];

// Cart State
function getCartKey() {
  try {
    const session = JSON.parse(localStorage.getItem('fourstyle_session') || 'null');
    if (session && session.email) {
      return 'fourstyle_cart_' + session.email.toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }
  } catch (e) {}
  // Guest: unique per browser tab session (not shared across users on same PC profiles ideally)
  // Still localStorage is per-origin per-browser-profile — different devices never share
  let guestId = localStorage.getItem('fourstyle_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('fourstyle_guest_id', guestId);
  }
  return 'fourstyle_cart_' + guestId;
}
let cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
// Clear old shared cart key (was incorrectly shared feel if same browser profile)
try { localStorage.removeItem('fourstyle_cart'); } catch (e) {}


let displayedProducts = 12;
let currentFilter = 'all';
let filteredProducts = [...products];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartBody = document.getElementById('cartBody');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const sortSelect = document.getElementById('sortSelect');

// ===== Category Filter =====
function filterCategory(category) {
  currentFilter = category || 'all';
  if (currentFilter === 'all') {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(p => p.category === currentFilter);
  }
  displayedProducts = 12;
  renderProducts();
  // Scroll to products
  const section = document.getElementById('products');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// ===== Search =====
function openSearch() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('searchInput');
    if (input) {
      input.value = '';
      input.focus();
      document.getElementById('searchResults').innerHTML = '<p class="search-hint">Type to search products...</p>';
    }
  }
}

function closeSearch() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function doSearch(query) {
  const results = document.getElementById('searchResults');
  if (!results) return;
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    results.innerHTML = '<p class="search-hint">Type to search products...</p>';
    return;
  }
  const matches = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.category && p.category.toLowerCase().includes(q))
  );
  if (matches.length === 0) {
    results.innerHTML = '<p class="search-hint">No products found.</p>';
    return;
  }
  results.innerHTML = matches.map(p => `
    <div class="search-item" onclick="closeSearch(); openProductModal(${p.id})">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <strong>${p.name}</strong>
        <span>Rs.${p.price.toLocaleString()}</span>
      </div>
    </div>
  `).join('');
}

// ===== Render Products =====
function renderProducts() {
  if (!productGrid) return;
  const list = filteredProducts.length ? filteredProducts : products;
  const toShow = list.slice(0, displayedProducts);
  if (toShow.length === 0) {
    productGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">No products in this category.</p>';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }
  productGrid.innerHTML = toShow.map(p => `
    <div class="product-card" data-id="${p.id}">
      ${p.discount ? `<span class="product-badge">-${p.discount}%</span>` : ''}
      <div class="product-img" onclick="openProductModal(${p.id})">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="quick-view-overlay"><i class="fas fa-search-plus"></i> Quick View</div>
      </div>
      <div class="product-info">
        <h3 onclick="openProductModal(${p.id})" style="cursor:pointer">${p.name}</h3>
        <div class="product-price">
          <span class="sale">Rs.${p.price.toLocaleString()}.00</span>
          ${p.original ? `<span class="regular">Rs.${p.original.toLocaleString()}.00</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn btn-primary add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });

  const listLen = (filteredProducts.length ? filteredProducts : products).length;
  if (displayedProducts >= listLen) {
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  } else {
    if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
  }
}

// ===== Product Modal (4 Images Gallery) =====
function openProductModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const imgs = product.images || [product.image, product.image, product.image, product.image];
  let currentImg = 0;

  const modal = document.getElementById('productModal');
  const mainImg = document.getElementById('modalMainImg');
  const thumbs = document.getElementById('modalThumbs');
  const modalName = document.getElementById('modalName');
  const modalPrice = document.getElementById('modalPrice');
  const modalOriginal = document.getElementById('modalOriginal');
  const modalBadge = document.getElementById('modalBadge');
  const modalAddBtn = document.getElementById('modalAddToCart');

  mainImg.src = imgs[0];
  mainImg.alt = product.name;
  modalName.textContent = product.name;
  modalPrice.textContent = `Rs.${product.price.toLocaleString()}.00`;
  modalOriginal.textContent = product.original ? `Rs.${product.original.toLocaleString()}.00` : '';
  modalBadge.textContent = product.discount ? `-${product.discount}%` : '';
  modalBadge.style.display = product.discount ? 'inline-block' : 'none';

  thumbs.innerHTML = imgs.map((src, i) => `
    <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" alt="View ${i + 1}">
  `).join('');

  thumbs.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentImg = parseInt(thumb.dataset.index);
      mainImg.src = imgs[currentImg];
      thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  modalAddBtn.onclick = () => {
    addToCart(id);
    closeProductModal();
  };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Cart Functions =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}
function loadCartForCurrentUser() {
  cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalItems;

  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    cartBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="price">Rs.${item.price.toLocaleString()}.00</div>
          <div class="cart-item-qty">
            <button onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
    if (cartFooter) {
      cartFooter.style.display = 'block';
      refreshCartOrderButtons();
      return;
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (cartSubtotal) cartSubtotal.textContent = `Rs.${subtotal.toLocaleString()}.00`;
}

function refreshCartOrderButtons() {
  const footer = document.getElementById('cartFooter');
  if (!footer || cart.length === 0) return;
  const session = JSON.parse(localStorage.getItem('fourstyle_session') || 'null');
  const loggedIn = session && session.email;
  let html = `
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <strong id="cartSubtotal">Rs.${cart.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()}.00</strong>
    </div>`;
  if (loggedIn) {
    html += `
      <button class="btn btn-primary btn-block" onclick="openCheckout()">Checkout</button>
      <button class="btn btn-block" style="background:#25D366;color:#fff;margin-top:8px;border:none;padding:12px;border-radius:8px;font-weight:600;cursor:pointer;width:100%;font-family:inherit;" onclick="orderViaWhatsApp()">
        <i class="fab fa-whatsapp"></i> Order via WhatsApp
      </button>`;
  } else {
    html += `
      <div style="background:#fff8e6;border:1px solid #f0d78c;border-radius:10px;padding:12px;margin-bottom:12px;font-size:13px;color:#5c4a00;line-height:1.5;">
        <strong>⚠️ Notice:</strong> Website se online order ke liye pehle <a href="login.html" style="color:#c9a227;font-weight:700;">Login / Sign Up</a> karein.
        <br>Warna seedha <strong>WhatsApp</strong> se order karein.
      </div>
      <button class="btn btn-block" style="background:#25D366;color:#fff;border:none;padding:14px;border-radius:8px;font-weight:600;cursor:pointer;width:100%;font-family:inherit;font-size:15px;" onclick="orderViaWhatsApp()">
        <i class="fab fa-whatsapp"></i> WhatsApp pe Order Karein
      </button>
      <a href="login.html" class="view-cart-link" style="display:block;text-align:center;margin-top:10px;">Login karke Online Order karein →</a>`;
  }
  html += `<a href="#" class="view-cart-link" onclick="closeCartSidebar(); return false;" style="display:block;margin-top:8px;">Continue Shopping</a>`;
  footer.innerHTML = html;
  footer.style.display = 'block';
}


function openCart() {
  if (cartSidebar) cartSidebar.classList.add('active');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  if (cartSidebar) cartSidebar.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Checkout Modal =====
function openCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  // Login required before placing order
  const session = JSON.parse(localStorage.getItem('fourstyle_session') || 'null');
  if (!session || !session.email) {
    alert('Order se pehle Login / Sign Up karein.\n\nYa WhatsApp se order karein.');
    window.location.href = 'login.html';
    return;
  }
  closeCartSidebar();

  const checkoutModal = document.getElementById('checkoutModal');
  const orderItems = document.getElementById('checkoutItems');
  const orderTotal = document.getElementById('checkoutTotal');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = 250;
  const total = subtotal + delivery;

  orderItems.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <p>Qty: ${item.qty} × Rs.${item.price.toLocaleString()}</p>
      </div>
      <span>Rs.${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `).join('');

  orderTotal.innerHTML = `
    <div class="total-row"><span>Subtotal</span><span>Rs.${subtotal.toLocaleString()}</span></div>
    <div class="total-row"><span>Delivery Charges</span><span>Rs.${delivery}</span></div>
    <div class="total-row grand"><span>Total</span><span>Rs.${total.toLocaleString()}</span></div>
  `;

  checkoutModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
  document.body.style.overflow = '';
}

function togglePaymentFields() {
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  const container = document.getElementById('paymentAccountFields');
  const walletFields = document.getElementById('walletFields');
  const bankFields = document.getElementById('bankFields');
  const note = document.getElementById('walletNote');
  if (!container) return;

  if (payment === 'Cash on Delivery') {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  if (payment === 'Bank Transfer') {
    walletFields.style.display = 'none';
    bankFields.style.display = 'block';
  } else {
    // JazzCash or EasyPaisa
    walletFields.style.display = 'block';
    bankFields.style.display = 'none';
    if (note) note.textContent = `Enter your ${payment} account number. Pay the total amount to our ${payment} and share screenshot on WhatsApp.`;
  }
}

function placeOrder(e) {
  e.preventDefault();
  const form = document.getElementById('checkoutForm');
  const name = form.querySelector('[name="name"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const phone = form.querySelector('[name="phone"]').value.trim();
  const address = form.querySelector('[name="address"]').value.trim();
  const payment = form.querySelector('input[name="payment"]:checked')?.value;
  const submitBtn = form.querySelector('.place-order-btn');

  if (!name || !email || !phone || !address || !payment) {
    alert('Please fill all fields including email and select a payment method.');
    return;
  }

  // Payment account validation
  let paymentDetails = {};
  if (payment === 'JazzCash' || payment === 'EasyPaisa') {
    const accNum = form.querySelector('[name="accountNumber"]')?.value.trim();
    const accName = form.querySelector('[name="accountName"]')?.value.trim();
    if (!accNum || !accName) {
      alert('Please enter your ' + payment + ' account number and account holder name.');
      return;
    }
    paymentDetails = { accountNumber: accNum, accountName: accName };
  } else if (payment === 'Bank Transfer') {
    const bankName = form.querySelector('[name="bankName"]')?.value.trim();
    const bankTitle = form.querySelector('[name="bankAccountTitle"]')?.value.trim();
    const bankAcc = form.querySelector('[name="bankAccountNumber"]')?.value.trim();
    if (!bankName || !bankTitle || !bankAcc) {
      alert('Please enter complete bank account details.');
      return;
    }
    paymentDetails = { bankName, bankAccountTitle: bankTitle, bankAccountNumber: bankAcc };
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
  }

  const orderId = 'FS' + Date.now();
  const order = {
    id: orderId,
    date: new Date().toLocaleString('en-PK'),
    timestamp: Date.now(),
    name,
    email,
    phone,
    address,
    payment,
    paymentDetails,
    items: cart.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      image: i.image
    })),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0) + 250,
    status: 'Pending'
  };

  function finishOrder() {
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
    }
    alert(`✅ Order placed successfully!\nOrder ID: ${orderId}\nPayment: ${payment}\nConfirmation email will be sent when order is confirmed.`);
  }

  try {
    if (typeof firebase !== 'undefined' && firebase.database) {
      firebase.database().ref('orders/' + orderId).set(order)
        .then(() => {
          const localOrders = JSON.parse(localStorage.getItem('fourstyle_orders') || '[]');
          localOrders.unshift(order);
          localStorage.setItem('fourstyle_orders', JSON.stringify(localOrders));
          finishOrder();
        })
        .catch((err) => {
          console.error('Firebase error:', err);
          const localOrders = JSON.parse(localStorage.getItem('fourstyle_orders') || '[]');
          localOrders.unshift(order);
          localStorage.setItem('fourstyle_orders', JSON.stringify(localOrders));
          finishOrder();
        });
    } else {
      const localOrders = JSON.parse(localStorage.getItem('fourstyle_orders') || '[]');
      localOrders.unshift(order);
      localStorage.setItem('fourstyle_orders', JSON.stringify(localOrders));
      finishOrder();
    }
  } catch (err) {
    console.error(err);
    const localOrders = JSON.parse(localStorage.getItem('fourstyle_orders') || '[]');
    localOrders.unshift(order);
    localStorage.setItem('fourstyle_orders', JSON.stringify(localOrders));
    finishOrder();
  }
}

// ===== Event Listeners =====
if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    displayedProducts += 8;
    renderProducts();
  });
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// Newsletter
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to Fourstyle! You will receive 10% off on your first order.');
    e.target.reset();
  });
}

// Sort
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    let sorted = [...products];
    switch (value) {
      case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
      case 'best': sorted.sort((a, b) => b.discount - a.discount); break;
      case 'new': sorted.reverse(); break;
      default: sorted = [...products];
    }
    products.length = 0;
    products.push(...sorted);
    displayedProducts = 12;
    renderProducts();
  });
}

// Sticky header
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
    }
  }
});

// Category dropdown clicks
document.querySelectorAll('[data-category]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    filterCategory(link.getAttribute('data-category'));
  });
});

// Search input
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => doSearch(e.target.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });
}

// Track website visit (once per session)
function trackVisit() {
  try {
    if (sessionStorage.getItem('fourstyle_visited')) return;
    sessionStorage.setItem('fourstyle_visited', '1');
    if (typeof firebase !== 'undefined' && firebase.database) {
      const visitRef = firebase.database().ref('stats/visits').push();
      visitRef.set({
        time: new Date().toLocaleString('en-PK'),
        timestamp: Date.now(),
        page: location.pathname
      });
      firebase.database().ref('stats/visitCount').transaction(c => (c || 0) + 1);
    }
  } catch (e) { console.log('visit track skip'); }
}

// Make functions global
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;

function orderViaWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const lines = cart.map(i => `• ${i.name} x${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0) + 250;
  const msg = encodeURIComponent(
    `Assalam o Alaikum Fourstyle!\n\nMujhe yeh order karna hai:\n\n${lines.join('\n')}\n\nDelivery: Rs.250\n*Total: Rs.${total.toLocaleString()}*\n\nMera naam: \nPhone: \nAddress: `
  );
  window.open('https://wa.me/923001234567?text=' + msg, '_blank');
}

window.openCheckout = openCheckout;
window.orderViaWhatsApp = orderViaWhatsApp;
window.closeCheckout = closeCheckout;
window.placeOrder = placeOrder;
window.filterCategory = filterCategory;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.togglePaymentFields = togglePaymentFields;

// Init
if (productGrid) {
  renderProducts();
  loadCartForCurrentUser();
  trackVisit();
}
