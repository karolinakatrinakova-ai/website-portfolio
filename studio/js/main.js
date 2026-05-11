/* ============================================================================
   STUDIO · main interactions
   - Page loader, scroll progress, navbar hide-on-scroll
   - Mobile menu, dropdown
   - Reveal on scroll (fade-in, stagger), count-up stats
   - Marquee (CSS), lightbox, drag gallery
   - Testimonial slider (autoplay + dots + drag)
   - Cookie banner, intro offer modal
   - Page exit transitions
   ========================================================================== */

(function () {
  'use strict';

  /* ─── Page loader ─── */
  var loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      loader.classList.add('loaded');
    });
  }

  /* ─── Scroll handlers ─── */
  var navbar = document.querySelector('.navbar');
  var backToTop = document.querySelector('.back-to-top');
  var progressBar = document.querySelector('.reading-progress');
  var mobileCta = document.querySelector('.mobile-cta');
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
      if (y > 300 && y > lastScrollY) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
    }
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
    if (mobileCta) mobileCta.classList.toggle('visible', y > 400);
    lastScrollY = y;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── Count-up stats ─── */
  var statNumbers = document.querySelectorAll('.stat__number[data-target]');
  if ('IntersectionObserver' in window && statNumbers.length) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '+';
        var duration = 1300;
        var start = performance.now();
        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target).toLocaleString('sk-SK') + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { statObs.observe(el); });
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

  /* ─── Lightbox ─── */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('.lightbox__img');
    document.querySelectorAll('.photo-grid__item img, .gallery-strip__img, [data-lightbox]').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lbImg.src = this.dataset.full || this.src;
        lbImg.alt = this.alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLb() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox__close')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLb();
    });
  }

  /* ─── Drag-to-scroll gallery strip ─── */
  document.querySelectorAll('.gallery-strip__track').forEach(function (track) {
    var down = false, startX = 0, scrollLeft = 0;
    track.addEventListener('pointerdown', function (e) {
      down = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.classList.add('grabbing');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointerup', function () {
      down = false;
      track.classList.remove('grabbing');
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX);
    });
  });

  /* ─── Testimonial slider ─── */
  document.querySelectorAll('.testimonial-slider').forEach(function (slider) {
    var track = slider.querySelector('.testimonial-slider__track');
    var cards = slider.querySelectorAll('.testimonial-card');
    var prev = slider.querySelector('.testimonial-slider__btn--prev');
    var next = slider.querySelector('.testimonial-slider__btn--next');
    var dotsBox = slider.querySelector('.testimonial-slider__dots');
    if (!track || !cards.length) return;
    var i = 0, autoplay = null;

    function visible() {
      var w = window.innerWidth;
      if (w <= 700) return 1;
      if (w <= 1000) return 2;
      return 3;
    }
    function maxIdx() { return Math.max(0, cards.length - visible()); }

    function buildDots() {
      if (!dotsBox) return;
      dotsBox.innerHTML = '';
      for (var k = 0; k <= maxIdx(); k++) {
        var d = document.createElement('button');
        d.className = 'testimonial-slider__dot' + (k === i ? ' active' : '');
        d.dataset.index = k;
        d.setAttribute('aria-label', 'Slide ' + (k + 1));
        dotsBox.appendChild(d);
      }
    }

    function go(idx) {
      i = Math.max(0, Math.min(idx, maxIdx()));
      var w = cards[0].offsetWidth + 24;
      track.style.transform = 'translateX(' + (-i * w) + 'px)';
      if (dotsBox) {
        dotsBox.querySelectorAll('.testimonial-slider__dot').forEach(function (d, k) {
          d.classList.toggle('active', k === i);
        });
      }
    }

    function play() {
      stop();
      autoplay = setInterval(function () {
        var n = i + 1;
        if (n > maxIdx()) n = 0;
        go(n);
      }, 5500);
    }
    function stop() { if (autoplay) clearInterval(autoplay); }

    if (prev) prev.addEventListener('click', function () { go(i - 1); play(); });
    if (next) next.addEventListener('click', function () { go(i + 1); play(); });
    if (dotsBox) dotsBox.addEventListener('click', function (e) {
      var d = e.target.closest('.testimonial-slider__dot');
      if (d) { go(parseInt(d.dataset.index, 10)); play(); }
    });

    var sx = 0, mx = 0, dragging = false;
    track.addEventListener('pointerdown', function (e) {
      dragging = true; sx = e.clientX; mx = 0;
      track.classList.add('grabbing');
      track.setPointerCapture(e.pointerId);
      stop();
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      mx = e.clientX - sx;
      var w = cards[0].offsetWidth + 24;
      track.style.transform = 'translateX(' + (-i * w + mx) + 'px)';
    });
    track.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('grabbing');
      if (mx < -60) go(i + 1);
      else if (mx > 60) go(i - 1);
      else go(i);
      play();
    });

    buildDots();
    play();
    window.addEventListener('resize', function () {
      buildDots();
      go(Math.min(i, maxIdx()));
    });
  });

  /* ─── Cookie banner ─── */
  var cb = document.getElementById('cookieBanner');
  if (cb) {
    if (localStorage.getItem('petal_cookies')) {
      cb.style.display = 'none';
    }
    cb.querySelectorAll('[data-cookie="accept"]').forEach(function (b) {
      b.addEventListener('click', function () {
        cb.style.display = 'none';
        localStorage.setItem('petal_cookies', 'accepted');
      });
    });
    cb.querySelectorAll('[data-cookie="decline"]').forEach(function (b) {
      b.addEventListener('click', function () {
        cb.style.display = 'none';
        localStorage.setItem('petal_cookies', 'declined');
      });
    });
  }

  /* ─── Intro offer modal ─── */
  var io2 = document.getElementById('introOffer');
  if (io2 && !sessionStorage.getItem('petal_intro')) {
    setTimeout(function () {
      io2.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 4500);
    function close2() {
      io2.classList.remove('active');
      document.body.style.overflow = '';
      sessionStorage.setItem('petal_intro', 'seen');
    }
    io2.querySelector('.intro-offer__overlay').addEventListener('click', close2);
    io2.querySelector('.intro-offer__close').addEventListener('click', close2);
    io2.querySelectorAll('a, button.intro-offer__cta').forEach(function (a) {
      a.addEventListener('click', close2);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && io2.classList.contains('active')) close2();
    });
  }

  /* ─── Announcement bar close ─── */
  var ab = document.querySelector('.announcement-bar');
  if (ab && localStorage.getItem('petal_announcement_closed') === '1') {
    ab.style.display = 'none';
  }
  var abClose = document.querySelector('.announcement-bar__close');
  if (abClose) {
    abClose.addEventListener('click', function () {
      ab.style.display = 'none';
      localStorage.setItem('petal_announcement_closed', '1');
    });
  }

  /* ─── FAQ keyboard / details handled natively ─── */
})();
