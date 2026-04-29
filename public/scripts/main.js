/**
 * Beebeeb - Animation & Interaction System
 * Vanilla JS. Works with Astro view transitions.
 */
(function () {
  if (window.__bbInitialized) return;
  window.__bbInitialized = true;

  /* ==========================================================
     SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  var revealObserver = null;

  function initScrollReveal() {
    if (revealObserver) revealObserver.disconnect();

    var selectors = '.bb-fade-up, .bb-reveal-left, .bb-reveal-right, .bb-reveal-scale';
    var elements = document.querySelectorAll(selectors);
    if (!elements.length) return;

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach(function (el) {
      if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
      }
    });
  }

  /* ==========================================================
     COUNTER ANIMATION
     ========================================================== */
  var counterObserver = null;

  function initCounters() {
    if (counterObserver) counterObserver.disconnect();

    var counters = document.querySelectorAll('.bb-counter[data-target]');
    if (!counters.length) return;

    counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    counters.forEach(function (el) {
      if (!el.dataset.animated) {
        counterObserver.observe(el);
      }
    });
  }

  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals, 10) || 0;
    var duration = 2000;
    var start = performance.now();
    el.dataset.animated = 'true';

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = eased * target;
      el.textContent =
        (el.dataset.prefix || '') +
        (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) +
        (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ==========================================================
     STAGGER GRID CHILDREN
     ========================================================== */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (parent) {
      var children = parent.querySelectorAll('.bb-fade-up, .bb-reveal-scale');
      children.forEach(function (child, i) {
        child.style.transitionDelay = i * 0.08 + 's';
      });
    });
  }

  /* ==========================================================
     FAQ ACCORDION
     ========================================================== */
  function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (other) {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !wasOpen);
      });
    });
  }

  /* ==========================================================
     NAVBAR SCROLL BEHAVIOR
     ========================================================== */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function updateNav() {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ==========================================================
     SCROLL PROGRESS BAR
     ========================================================== */
  function initScrollProgress() {
    var bar = document.querySelector('.bb-scroll-progress');
    if (!bar) return;

    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        bar.style.transform = 'scaleX(' + (scrollTop / docHeight) + ')';
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ==========================================================
     MOBILE MENU
     ========================================================== */
  function initMobileMenu() {
    var menuToggle = document.getElementById('menuToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileBackdrop = document.getElementById('mobileMenuBackdrop');

    if (!menuToggle || !mobileMenu) return;

    function closeMobile() {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      if (mobileBackdrop) mobileBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobile();
      } else {
        mobileMenu.classList.add('open');
        menuToggle.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobile);

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobile);
    });
  }

  /* ==========================================================
     INIT ALL
     ========================================================== */
  function initAll() {
    initScrollReveal();
    initCounters();
    initStagger();
    initFaqAccordion();
    initNavbar();
    initScrollProgress();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
