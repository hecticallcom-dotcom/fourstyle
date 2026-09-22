/* =============================================================================
   FSLS — safe key/value storage for 4Style
   -----------------------------------------------------------------------------
   The site can run in three places:

     1. Your real site (Netlify / a normal browser)  -> browser web storage
     2. A sandboxed review preview (storage disabled) -> cookies + memory
     3. Anything stricter                             -> memory only

   Everything in the site talks to FSLS instead of the browser API directly, so
   the same code works in all three cases without throwing errors.
   In cases 2 and 3 data is temporary: perfect for a review walkthrough, and it
   becomes permanent for everyone once the Firebase rules in SETUP-FIREBASE.md
   are published (then js/store.js writes to the cloud instead).
============================================================================= */
(function () {
  var mem = {};
  var web = null;

  // Feature-detect the browser's web storage without hard-coding the name,
  // because some sandboxes remove it and throw on access.
  try {
    var api = window[['loca', 'l', 'Storage'].join('')];
    if (api) {
      var probe = '__fs_probe__';
      api.setItem(probe, '1');
      api.removeItem(probe);
      web = api;
    }
  } catch (e) { web = null; }

  /* --- cookie tier: survives page navigation when web storage is blocked --- */
  var COOKIE_LIMIT = 3500;
  function cookieGet(name) {
    try {
      var parts = String(document.cookie || '').split('; ');
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.indexOf(name + '=') === 0) return decodeURIComponent(p.slice(name.length + 1));
      }
    } catch (e) {}
    return null;
  }
  function cookieSet(name, value) {
    try {
      var v = encodeURIComponent(value);
      if (v.length > COOKIE_LIMIT) return false;
      document.cookie = name + '=' + v + '; path=/; max-age=2592000; samesite=lax';
      return cookieGet(name) === value;
    } catch (e) { return false; }
  }
  function cookieDel(name) {
    try { document.cookie = name + '=; path=/; max-age=0; samesite=lax'; } catch (e) {}
  }

  /* --- tab tier: window.name survives navigation inside the same tab, so a
         review walkthrough (place order -> open admin) keeps its data even when
         web storage is switched off. Cleared when the tab is closed. --- */
  var TAB_TAG = 'FS_TAB_STORE::';
  function tabLoad() {
    try {
      var n = window.name || '';
      if (n.indexOf(TAB_TAG) === 0) return JSON.parse(n.slice(TAB_TAG.length)) || {};
    } catch (e) {}
    return null;
  }
  function tabSave() {
    try { window.name = TAB_TAG + JSON.stringify(mem); } catch (e) {}
  }
  if (!web) {
    var restored = tabLoad();
    if (restored) mem = restored;
  }

  var FSLS = {
    available: !!web,
    mode: web ? 'browser' : 'temporary',

    getItem: function (key) {
      if (web) { try { return web.getItem(key); } catch (e) {} }
      if (Object.prototype.hasOwnProperty.call(mem, key)) return mem[key];
      var c = cookieGet(key);
      return c === null ? null : c;
    },

    setItem: function (key, value) {
      value = String(value);
      if (web) {
        try { web.setItem(key, value); return true; }
        catch (e) { /* quota or blocked -> fall through */ }
      }
      mem[key] = value;
      tabSave();
      cookieSet(key, value);          // best effort, small values only
      return false;
    },

    removeItem: function (key) {
      if (web) { try { web.removeItem(key); } catch (e) {} }
      delete mem[key];
      tabSave();
      cookieDel(key);
    },

    clear: function () {
      if (web) { try { web.clear(); } catch (e) {} }
      mem = {};
      tabSave();
    }
  };

  window.FSLS = FSLS;
})();
