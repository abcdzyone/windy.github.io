(function () {
  'use strict';

  /* ── Reading category tabs ── */
  const cats = document.querySelectorAll('.reading-cat');
  const panels = document.querySelectorAll('.reading-panel');

  cats.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.cat;
      cats.forEach(function (c) { c.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.querySelector('[data-panel="' + cat + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Mobile navigation ── */
  var toggle = document.querySelector('.mobile-nav-toggle');
  var nav = document.querySelector('.mobile-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      nav.setAttribute('aria-hidden', !open);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ── Smooth scroll offset for in-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
