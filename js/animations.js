/* Fourstyle – Animations (scroll reveal, progress bar, back-to-top, cart bump) */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  var root = document.documentElement;
  root.classList.add('fs-anim-ready');

  // Hero glow orbs
  var hero = document.querySelector('.hero');
  if (hero) {
    ['o1', 'o2', 'o3'].forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'fs-orb ' + c;
      s.setAttribute('aria-hidden', 'true');
      hero.appendChild(s);
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('fs-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // selector -> extra class; stagger children inside same parent
  var groups = [
    ['.section-title', ''],
    ['.section-subtitle', ''],
    ['.category-card', 'fs-zoom'],
    ['.product-card', ''],
    ['.premium-content', 'fs-zoom'],
    ['.testimonial-card', ''],
    ['.faq-item', ''],
    ['.why-card', ''],
    ['.contact-info', 'fs-left'],
    ['.contact-grid > :not(.contact-info)', 'fs-right'],
    ['.footer-col', '']
  ];

  function prep(el, extra) {
    if (el.classList.contains('fs-reveal')) return;
    var siblings = el.parentElement ? el.parentElement.children : [];
    var idx = Array.prototype.indexOf.call(siblings, el);
    el.style.setProperty('--fs-delay', (Math.min(idx, 7) * 0.08) + 's');
    el.classList.add('fs-reveal');
    if (extra) el.classList.add(extra);
    io.observe(el);
  }

  function scan() {
    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el) { prep(el, g[1]); });
    });
  }
  scan();

  // Products / categories are rendered dynamically – watch for them
  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; scan(); });
  }).observe(document.body, { childList: true, subtree: true });

  // Scroll progress bar + back to top
  var bar = document.createElement('div');
  bar.className = 'fs-progress';
  document.body.appendChild(bar);

  var top = document.createElement('button');
  top.className = 'fs-top';
  top.type = 'button';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<i class="fas fa-arrow-up"></i>';
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.body.appendChild(top);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      top.classList.toggle('show', window.scrollY > 600);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Cart count bump when number changes
  var cc = document.getElementById('cartCount');
  if (cc) {
    var last = cc.textContent;
    new MutationObserver(function () {
      if (cc.textContent !== last) {
        last = cc.textContent;
        cc.classList.remove('fs-bump');
        void cc.offsetWidth;
        cc.classList.add('fs-bump');
      }
    }).observe(cc, { childList: true, characterData: true, subtree: true });
  }
})();
