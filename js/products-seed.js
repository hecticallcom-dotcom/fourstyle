/* ===== FOURSTYLE — Seed Catalogue =====
   This is the starting inventory. Once products are added / imported through the
   Admin Panel (Inventory section) the saved catalogue takes over and this file is
   only used as a first-run fallback.

   Fields per product:
     id, sku, name, price, original, discount, category, brand,
     images[] (1st = main image, rest = extra angles), stock, lowStock, description
*/
const SEED_PRODUCTS = [
  {
    id: 1, sku: "FS-W-001", name: "Hublot Diamond Cut Heavy Watch",
    price: 2999, original: 3850, category: "watches", brand: "Hublot Style",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=700&h=700&fit=crop"
    ],
    stock: 14, lowStock: 5,
    description: "Heavy diamond-cut bezel with a solid chain strap. Water resistant, premium gift box included."
  },
  {
    id: 2, sku: "FS-W-002", name: "Tissot PRX 1853",
    price: 2999, original: 3850, category: "watches", brand: "Tissot Style",
    images: [
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=700&h=700&fit=crop"
    ],
    stock: 9, lowStock: 5,
    description: "Integrated bracelet, waffle dial finish. A modern classic for daily wear."
  },
  {
    id: 3, sku: "FS-W-003", name: "Rolex Jubilee Chain Semi Automatic",
    price: 3450, original: 4450, category: "watches", brand: "Rolex Style",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=700&h=700&fit=crop"
    ],
    stock: 4, lowStock: 5,
    description: "Jubilee-style chain with semi-automatic movement and a visible sweeping second hand."
  },
  {
    id: 4, sku: "FS-W-004", name: "Cartier Tank",
    price: 2499, original: 3850, category: "watches", brand: "Cartier Style",
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=700&h=700&fit=crop"
    ],
    stock: 11, lowStock: 5,
    description: "Rectangular tank case with roman dial. Slim profile, dress-watch elegance."
  },
  {
    id: 5, sku: "FS-W-005", name: "Tissot 1853 Chronograph",
    price: 3850, original: 4550, category: "watches", brand: "Tissot Style",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=700&h=700&fit=crop"
    ],
    stock: 7, lowStock: 5,
    description: "Working chronograph dials with a brushed steel case and sapphire-look glass."
  },
  {
    id: 6, sku: "FS-W-006", name: "Rolex Oyster Semi Auto",
    price: 3550, original: 4250, category: "watches", brand: "Rolex Style",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=700&h=700&fit=crop"
    ],
    stock: 12, lowStock: 5,
    description: "Oyster-style bracelet, semi automatic movement, screw-down crown detailing."
  },
  {
    id: 7, sku: "FS-W-007", name: "Patek Philippe Geneve",
    price: 2999, original: 3850, category: "watches", brand: "Patek Style",
    images: [
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop"
    ],
    stock: 3, lowStock: 5,
    description: "Clean Geneve dial with slim gold-tone indices. Understated and formal."
  },
  {
    id: 8, sku: "FS-W-008", name: "Rolex Oyster Datejust Truetone",
    price: 2999, original: 3850, category: "watches", brand: "Rolex Style",
    images: [
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=700&h=700&fit=crop"
    ],
    stock: 16, lowStock: 5,
    description: "Two-tone truetone finish with date window at 3 o'clock."
  },
  {
    id: 9, sku: "FS-AW-001", name: "Rolex Automatic",
    price: 5999, original: 7999, category: "automatic-watches", brand: "Rolex Style",
    images: [
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&h=700&fit=crop"
    ],
    stock: 5, lowStock: 5,
    description: "Full automatic movement with exhibition back. No battery required."
  },
  {
    id: 10, sku: "FS-AW-002", name: "Rolex GMT Master Semi Automatic",
    price: 3550, original: 4850, category: "automatic-watches", brand: "Rolex Style",
    images: [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop"
    ],
    stock: 8, lowStock: 5,
    description: "Dual-tone GMT bezel, 24-hour hand, semi automatic calibre."
  },
  {
    id: 11, sku: "FS-W-009", name: "Hublot Strap Classic",
    price: 2150, original: 2850, category: "watches", brand: "Hublot Style",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop"
    ],
    stock: 2, lowStock: 5,
    description: "Soft rubber strap with a classic round case. Light on the wrist."
  },
  {
    id: 12, sku: "FS-AW-003", name: "Tissot PRX Semi Automatic",
    price: 3350, original: 4250, category: "automatic-watches", brand: "Tissot Style",
    images: [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=700&h=700&fit=crop"
    ],
    stock: 6, lowStock: 5,
    description: "Open-heart semi automatic PRX with integrated steel bracelet."
  },
  {
    id: 13, sku: "FS-C-001", name: "Premium Trucker Cap",
    price: 999, original: 1499, category: "caps", brand: "Fourstyle",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=700&h=700&fit=crop"
    ],
    stock: 22, lowStock: 6,
    description: "Structured cotton cap with adjustable strap. One size fits all."
  },
  {
    id: 14, sku: "FS-G-001", name: "Classic Aviator Sunglasses",
    price: 1299, original: 1999, category: "glasses", brand: "Fourstyle",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=700&h=700&fit=crop"
    ],
    stock: 15, lowStock: 6,
    description: "UV400 aviator lenses in a metal frame. Hard case included."
  },
  {
    id: 15, sku: "FS-WL-001", name: "Leather Wallet Brown",
    price: 1499, original: 2199, category: "wallets", brand: "Fourstyle",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&h=700&fit=crop"
    ],
    stock: 1, lowStock: 6,
    description: "Bi-fold leather wallet with six card slots and a hidden note pocket."
  },
  {
    id: 16, sku: "FS-W-010", name: "Al Salah Dual Time Watch",
    price: 3999, original: 5000, category: "watches", brand: "Fourstyle",
    images: [
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&h=700&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=700&h=700&fit=crop"
    ],
    stock: 10, lowStock: 5,
    description: "Dual time display with prayer-time alarm function and date window."
  }
];

/* Categories shown in the menus and on the category strip */
const CATEGORY_LIST = [
  { slug: "watches",            label: "Watches" },
  { slug: "automatic-watches",  label: "Automatic Watches" },
  { slug: "caps",               label: "Caps" },
  { slug: "glasses",            label: "Sunglasses" },
  { slug: "wallets",            label: "Wallets" }
];

const BRAND_LIST = ["Rolex Style", "Hublot Style", "Tissot Style", "Cartier Style", "Patek Style", "Fourstyle"];

window.SEED_PRODUCTS = SEED_PRODUCTS;
window.CATEGORY_LIST = CATEGORY_LIST;
window.BRAND_LIST = BRAND_LIST;
