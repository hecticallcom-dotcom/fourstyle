# Making the data permanent (Firebase Realtime Database)

The site already contains your Firebase project (`fourstyle`, `js/firebase-config.js`).
Everything — products, orders, payment slips, contact messages, reports — is written
through one data layer (`js/store.js`).

That layer works in two modes and switches automatically:

| Mode | When | Where data lives |
|------|------|------------------|
| **Cloud mode** | Firebase Realtime Database accepts read/write | Your Firebase project — shared across every device, permanent |
| **Local mode** | Database rules refuse access (current state) | The visitor's own browser (localStorage) — great for review, not shared |

Right now the database returns `Permission denied`, so the site runs in **local mode** and the
admin panel shows a yellow banner saying so. Publishing the rules below switches it to cloud
mode — **no code change is required**.

## Step 1 — open the database rules

1. Go to <https://console.firebase.google.com/> and open the **fourstyle** project.
2. Left menu → **Build → Realtime Database**.
3. If the database does not exist yet, click **Create Database**, choose the
   **Singapore (asia-southeast1)** location (this matches
   `https://fourstyle-default-rtdb.asia-southeast1.firebasedatabase.app` already in the code)
   and start in **locked mode**.
4. Open the **Rules** tab.

## Step 2 — paste these rules and click Publish

Simple version (fastest, good enough to go live today — anyone who knows the URL could in
theory write, so move to Step 3 when you have time):

```json
{
  "rules": {
    "products": { ".read": true, ".write": true },
    "orders":   { ".read": true, ".write": true },
    "slips":    { ".read": true, ".write": true },
    "messages": { ".read": true, ".write": true },
    "stats":    { ".read": true, ".write": true }
  }
}
```

## Step 3 — recommended hardened version (after you enable Firebase Auth)

1. Firebase console → **Build → Authentication → Get started → Email/Password → Enable**.
2. **Users → Add user** → create your admin user (for example `admin@fourstyle.pk`).
3. Publish these rules:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    },
    "orders": {
      ".read": "auth != null",
      "$orderId": { ".write": true, ".read": true }
    },
    "slips": {
      ".read": "auth != null",
      "$slipId": { ".write": true }
    },
    "messages": {
      ".read": "auth != null",
      "$msgId": { ".write": true }
    },
    "stats": { ".read": "auth != null", ".write": true }
  }
}
```

With these rules customers can still place orders, upload slips and send messages, while
only a signed-in admin can list them or edit the catalogue.

## Step 4 — confirm it worked

1. Hard-refresh `admin.html` (Ctrl/Cmd + Shift + R).
2. The yellow banner should turn into **"Cloud mode: data is saved in your Firebase
   database"**.
3. Add one product, then open the site on your phone — the product should be there too.

## Note about payment-slip images

Slips are compressed in the browser and stored as image data inside the database, so no
Firebase Storage billing setup is needed. If you later expect hundreds of slips per month,
move them to Firebase Storage (`storageBucket: fourstyle.firebasestorage.app` is already in
the config) — only `uploadSlip()` inside `js/store.js` would need to change.

## Anything else to know

* In local mode every browser keeps its own copy, so a slip uploaded by a customer will not
  appear in your admin panel on another device. This is exactly what the rules above fix.
* Deleting the browser data in local mode deletes the test records — that is fine, the seed
  catalogue (`js/products-seed.js`) reloads automatically.
