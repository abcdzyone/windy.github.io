(function () {
  'use strict';

  // Dark mode toggle
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    var stored = localStorage.getItem('windy-theme');
    if (stored === 'dark') document.documentElement.classList.add('dark');

    themeBtn.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem(
        'windy-theme',
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    });
  }

  // Header scroll shadow
  var header = document.querySelector('[data-header]');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]');
      } else {
        header.classList.remove('shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]');
      }
    });
  }

  // Reading progress bar
  var progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var winScroll = document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = (winScroll / height) * 100 + '%';
    });
  }

  // Copy code blocks (article_detail.html pattern)
  window.copyCode = function (btn) {
    var block = btn.closest('[data-code-block]') || btn.closest('.border-4');
    if (!block) return;
    var codeEl = block.querySelector('code');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(function () {
      var label = btn.querySelector('[data-copy-label]') || btn.querySelector('.font-black');
      if (label) {
        var orig = label.innerText;
        label.innerText = '已复制';
        btn.classList.add('bg-white', 'text-black');
        setTimeout(function () {
          label.innerText = orig;
          btn.classList.remove('bg-white', 'text-black');
        }, 2000);
      }
    });
  };

  // Smooth scroll for TOC
  document.querySelectorAll('[data-toc] a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });

  // Anchor links
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

  // Mobile menu
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      mobileNav.classList.toggle('hidden');
    });
  }


  // Newsletter form mock
  document.querySelectorAll('[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('感谢订阅！（演示模式）');
      form.reset();
    });
  });

  // Blog search filter (client-side)
  var searchInput = document.getElementById('blog-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.toLowerCase();
      document.querySelectorAll('[data-article]').forEach(function (article) {
        var text = article.textContent.toLowerCase();
        article.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
})();
