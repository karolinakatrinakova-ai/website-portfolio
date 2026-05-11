/* ============================================================================
   STUDIO · main interactions (Sála restaurant)
   - Page loader, scroll progress, navbar hide-on-scroll, mobile menu
   - Reveal on scroll, count-up stats, lightbox, drag gallery
   - Tasting menu course revealer (hover index → show that course's image)
   - Reservation page step flow
   - Cookie banner, page exit transitions
   ========================================================================== */

(function () {
  'use strict';

  /* ─── Page loader ─── */
  var loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () { loader.classList.add('loaded'); });
  }

  /* ─── Scroll handlers ─── */
  var navbar = document.querySelector('.navbar');
  var backToTop = document.querySelector('.back-to-top');
  var progressBar = document.querySelector('.reading-progress');
  var lastScrollY = 0;
  var hasHeroBanner = !!document.querySelector('.banner');

  function onScroll() {
    var y = window.scrollY;
    if (progressBar) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    }
    if (navbar) {
      navbar.classList.toggle('scrolled', hasHeroBanner ? y > 60 : true);
      if (y > 300 && y > lastScrollY) navbar.classList.add('hidden');
      else navbar.classList.remove('hidden');
    }
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
    lastScrollY = y;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ─── Hamburger / mobile menu ─── */
  var hamburger = document.querySelector('.navbar-hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = !hamburger.classList.contains('active');
      hamburger.classList.toggle('active', open);
      mobileMenu.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── Reveal on scroll ─── */
  var revealEls = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stagger-children');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── Page exit transitions (skips same-page anchor links) ─── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//')
        || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank'
        || link.hasAttribute('download') || link.dataset.noTransition) return;
    // Detect same-page navigation (e.g. "index.html#chef" while on index.html)
    // — let the browser handle hash scrolling without fading the page out.
    try {
      var url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        e.preventDefault();
        var target = document.querySelector(url.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', url.hash);
        } else {
          window.location.hash = url.hash;
        }
        return;
      }
    } catch (err) { /* fall through to normal exit */ }
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(function () { window.location.href = href; }, 300);
  });

  // Restore page if Safari/Firefox serve it from bfcache after the user
  // hits the browser back button — otherwise the page-exit (opacity:0)
  // class stays applied and the previous page looks blank.
  window.addEventListener('pageshow', function (e) {
    document.body.classList.remove('page-exit');
  });

  /* ─── Tasting menu : hover/focus a course row → swap the cinematic right-side image ─── */
  document.querySelectorAll('[data-tasting]').forEach(function (root) {
    var rows = root.querySelectorAll('.tasting__row');
    var stage = root.querySelector('.tasting__stage img');
    if (!rows.length || !stage) return;
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', activate);
      row.addEventListener('focusin', activate);
    });
    function activate() {
      rows.forEach(function (r) { r.classList.remove('is-active'); });
      this.classList.add('is-active');
      var src = this.dataset.image;
      if (src && stage.src.indexOf(src) === -1) {
        stage.style.opacity = '0';
        setTimeout(function () {
          stage.src = src;
          stage.style.opacity = '1';
        }, 220);
      }
    }
  });

  /* ─── Reservation step flow ─── */
  var resv = document.querySelector('[data-resv-flow]');
  if (resv) {
    var stepEls = resv.querySelectorAll('.resv-step');
    var dots = resv.querySelectorAll('.resv-progress__dot');
    var summary = resv.querySelector('[data-resv-summary]');
    var state = { date: '', time: '', size: 2, name: '', email: '', phone: '', notes: '' };
    function showStep(n) {
      stepEls.forEach(function (s, i) { s.classList.toggle('is-active', i === n); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === n); d.classList.toggle('is-done', i < n); });
      writeSummary();
      window.scrollTo({ top: resv.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
    function writeSummary() {
      if (!summary) return;
      summary.querySelector('[data-summary="date"]').textContent = state.date || '—';
      summary.querySelector('[data-summary="time"]').textContent = state.time || '—';
      summary.querySelector('[data-summary="size"]').textContent = state.size + (state.size > 1 ? ' guests' : ' guest');
    }
    resv.querySelectorAll('[data-resv-time]').forEach(function (b) {
      b.addEventListener('click', function () {
        resv.querySelectorAll('[data-resv-time]').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        state.time = b.textContent.trim();
      });
    });
    resv.querySelectorAll('[data-resv-size]').forEach(function (b) {
      b.addEventListener('click', function () {
        resv.querySelectorAll('[data-resv-size]').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        state.size = parseInt(b.dataset.resvSize, 10) || 2;
      });
    });
    var dateInput = resv.querySelector('[data-resv-date]');
    if (dateInput) {
      dateInput.addEventListener('change', function () { state.date = dateInput.value; });
    }
    resv.querySelectorAll('[data-step-next]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(b.dataset.stepNext, 10);
        showStep(n);
      });
    });
    resv.querySelectorAll('[data-step-back]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(b.dataset.stepBack, 10);
        showStep(n);
      });
    });
    resv.querySelectorAll('[name="name"], [name="email"], [name="phone"], [name="notes"]').forEach(function (i) {
      i.addEventListener('input', function () {
        state[i.name] = i.value;
      });
    });
    var form = resv.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        showStep(stepEls.length - 1); // confirmation step
      });
    }
  }

  /* ─── Cookie banner ─── */
  var cb = document.getElementById('cookieBanner');
  if (cb) {
    if (localStorage.getItem('sage_cookies')) cb.style.display = 'none';
    cb.querySelectorAll('[data-cookie="accept"]').forEach(function (b) {
      b.addEventListener('click', function () {
        cb.style.display = 'none';
        localStorage.setItem('sage_cookies', 'accepted');
      });
    });
    cb.querySelectorAll('[data-cookie="decline"]').forEach(function (b) {
      b.addEventListener('click', function () {
        cb.style.display = 'none';
        localStorage.setItem('sage_cookies', 'declined');
      });
    });
  }
})();
