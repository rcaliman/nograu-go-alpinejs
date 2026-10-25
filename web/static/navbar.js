(function () {
  function whenNavReady(fn) {
    if (window.NOGRAU_NAV) { fn(); return; }
    var id = setInterval(function () {
      if (window.NOGRAU_NAV) { clearInterval(id); fn(); }
    }, 10);
  }

  function initNavbar() {
    var api = window.NOGRAU_NAV;
    var navToggleBtn = document.getElementById('nav-toggle-btn');
    var siteNav = document.getElementById('site-nav');
    var navIconOpen = document.getElementById('nav-toggle-icon-open');
    var navIconClose = document.getElementById('nav-toggle-icon-close');
    var langFlagBtn = document.getElementById('lang-flag-btn');
    var langMenu = document.getElementById('lang-menu');
    var langFlagPt = document.getElementById('lang-flag-pt');
    var langFlagEn = document.getElementById('lang-flag-en');
    var langMenuPt = document.getElementById('lang-menu-pt');
    var langMenuEn = document.getElementById('lang-menu-en');
    if (!navToggleBtn || !siteNav) return;

    function applyTexts() {
      document.querySelectorAll('#site-nav [data-i18n]').forEach(function (el) {
        el.textContent = api.t(el.dataset.i18n);
      });
      var isPt = api.getLang() !== 'en';
      langFlagPt.style.display = isPt ? 'block' : 'none';
      langFlagEn.style.display = isPt ? 'none' : 'block';
      langMenuPt.classList.toggle('lang-menu-item-active', isPt);
      langMenuEn.classList.toggle('lang-menu-item-active', !isPt);
      navToggleBtn.setAttribute('aria-label', api.t('nav.toggleAria'));
      langFlagBtn.setAttribute('aria-label', api.t('lang.toggleAria'));
    }

    function setNavOpen(open) {
      siteNav.classList.toggle('header-nav-open', open);
      navToggleBtn.setAttribute('aria-expanded', String(open));
      navIconOpen.hidden = open;
      navIconClose.hidden = !open;
    }

    function setLangMenuOpen(open) {
      langMenu.hidden = !open;
      langFlagBtn.setAttribute('aria-expanded', String(open));
    }

    navToggleBtn.addEventListener('click', function () {
      setNavOpen(!siteNav.classList.contains('header-nav-open'));
    });

    langFlagBtn.addEventListener('click', function () {
      setLangMenuOpen(langMenu.hidden);
    });

    langMenuPt.addEventListener('click', function () {
      api.setLang('pt');
      applyTexts();
      setLangMenuOpen(false);
    });

    langMenuEn.addEventListener('click', function () {
      api.setLang('en');
      applyTexts();
      setLangMenuOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!langMenu.hidden && !langMenu.contains(e.target) && !langFlagBtn.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (siteNav.classList.contains('header-nav-open') && !siteNav.contains(e.target) && !navToggleBtn.contains(e.target)) {
        setNavOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
        setNavOpen(false);
      }
    });

    applyTexts();
  }

  function load() {
    var mount = document.getElementById('navbar-mount');
    if (!mount) return;
    fetch('/navbar.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        mount.outerHTML = html;
        whenNavReady(initNavbar);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
