# 4Style — update review notes

Nothing has been deployed to Netlify. This build is for your review first (requirement 12).

Test accounts already inside the build:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@fourstyle.pk` | (the existing admin password already set in `login.html`) |
| Customer | create your own on the Sign Up page | — |

Admin panel: log in with the admin account on `login.html` — you are redirected to
`admin.html` automatically. Customers never see the admin link.

---

## 1. Logo border

The gold ring is now drawn from the logo's own size with CSS variables
(`--logo-size` / `--logo-ring` in `css/fourstyle-v2.css`), so the ring thickness and the gap
scale with the logo instead of being a fixed border. It stays proportional in the header, on
the login/signup pages and on mobile (logo shrinks, ring shrinks with it).

## 2. Product cards

* Every card is an equal-height flex column and the action row is pinned with
  `margin-top:auto`, so **"Add to Cart" sits at the same position on every card**
  (verified: identical 525 px card height, button 17 px from the bottom on all cards).
* Each product supports **1 main image + a variable number of thumbnails** (a watch has 4
  angles, a cap can have 1–2). Thumbnails appear under the main image on the card and in the
  quick-view popup; clicking a thumbnail swaps the main image instantly. The number of
  images per product is whatever you enter in the admin panel — no fixed limit.

## 3. Background / scroll behaviour

The black-and-gold hero is no longer a fixed full-screen layer. It is a normal section with
a capped height, so scrolling past it reveals the category strip and the full product grid
normally. Page scroll is only locked while the cart or a modal is open, and it is restored
when they close.

## 4. Contact Us page

New page `contact.html` with the four requested fields — **email address, WhatsApp number,
address and a "Your question" text box** — plus validation, a success message, and a side
card with WhatsApp/email/delivery info. Every message lands in **Admin → Messages** with
one-click "Reply on WhatsApp" and "Reply by email" buttons.

## 5. Category & brand filtering

* The category strip and the nav "Categories" dropdown filter the grid to that category
  (e.g. Accessories, Caps, Watches, Glasses, Wallets).
* The nav "Brands" dropdown filters to a single brand (e.g. Rolex Style under Watches).
* An active filter shows a chip such as `Category: Caps ×` plus a "Show all products" link,
  and the result count updates ("3 products").
* Search, category and brand filters work together.

## 6. Price / Buy button

The price is now a working button: clicking it adds the item to the cart, opens the cart
sidebar and shows a toast. Logged-in customers get the full checkout; guests get a "please
log in" note plus the WhatsApp order option.

## 7 & 8. Login / Signup pages

* Both pages show the **"Welcome 4Style"** heading with the gold-ringed logo.
* The **unwanted scrollbar is gone** — the pages use `100dvh` with `box-sizing:border-box`
  and the decorative gradient sits in a clipped fixed layer (measured: 0 px vertical and
  0 px horizontal overflow at desktop sizes).

## 9. Payment methods + payment slip

Checkout shows three methods with copy-to-clipboard boxes:

* **JazzCash / EasyPaisa** — 0344 1514744, Muhammad Ramzan
* **Bank Transfer** — Account name Muhammad Ramzan, Account number 1611534361014057
* Cash on Delivery (kept from the old site)

After placing the order, step 2 asks the customer to **upload the payment slip** (JPG/PNG/PDF,
compressed in the browser). On success they see:
**"Your payment slip has been uploaded successfully."** The slip immediately appears in
**Admin → Payment Slips** where you can view it full size, download it, **Verify** (which also
marks the order Confirmed) or **Reject** it.

## 10. Admin panel — inventory

* **Add product** — name, SKU, category, brand, price, original price, quantity, low-stock
  alert level, description and as many image URLs or uploaded files as you need.
* **Edit** on every row, plus delete.
* **Excel import** — "Download Excel template", fill it in Excel, then import as
  **merge** (update existing by SKU / add new) or **replace** (fresh catalogue). `.xlsx`,
  `.xls` and `.csv` all work, and column names are matched flexibly
  (e.g. `quantity`, `qty`, `stock` all work).
* **Export** the whole inventory to Excel.
* **Low-stock alerts** — rows at or below their alert level turn red with a
  **RUNNING OUT** badge, and the dashboard has a "Low stock alert" table.
* **Search bar** inside the inventory section (name, SKU, brand, category).

## 11. Admin panel — reports

* **Daily sales report** — today/yesterday/this-month cards, a per-day chart and a day-by-day
  table.
* **Monthly chart toggle** — switch to a monthly sales chart with a month-by-month table.
* **Export to Excel** on both views, plus separate order and inventory exports.

## 12. Review before deploy

Nothing was pushed to Netlify or the GitHub repo. Tell me what to change; when you approve I
can publish a shareable link, prepare a Netlify-Drop zip, or push the updated files to
`hecticallcom-dotcom/fourstyle`.

---

## Important: where the data is saved

The site is still static HTML/CSS/JS, but it now talks to the Firebase Realtime Database that
was already in your project. Firebase currently answers `Permission denied`, so the site runs
in **local mode** (data saved in the browser) and the admin panel says so in a yellow banner.

Publishing the rules in **SETUP-FIREBASE.md** (a 2-minute job in the Firebase console)
switches the same code to permanent cloud storage shared across all devices — no code change.
Until then, treat products/orders/slips you create as review test data.

## Files

| File | What changed |
|------|--------------|
| `index.html` | Rebuilt shop: logo ring, nav with category + brand dropdowns, non-fixed hero, category strip, filter chips, cards with thumbnails, quick view, cart, checkout + slip upload |
| `contact.html` | New Contact Us page |
| `login.html`, `signup.html` | "Welcome 4Style", no scrollbar, admin redirect |
| `admin.html` | New admin panel (dashboard, orders, slips, inventory, reports, messages) |
| `js/store.js` | Data layer: Firebase when allowed, browser storage otherwise |
| `js/products-seed.js` | Starter catalogue with SKU, brand, stock, multiple images |
| `js/script.js` | Shop logic: filters, thumbnails, price button, cart, checkout, slip upload |
| `js/admin.js` | Admin logic: CRUD, Excel import/export, charts, slip review |
| `css/fourstyle-v2.css`, `css/auth.css`, `css/admin.css` | New styling layers (original `css/styles.css` untouched) |
| `SETUP-FIREBASE.md` | How to make the data permanent |
