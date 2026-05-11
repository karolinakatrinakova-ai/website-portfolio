/* ============================================================================
   STUDIO · i18n
   - Načíta i18n/<lang>.json (sk / cs / en)
   - Aplikuje preklady na elementy s [data-i18n="kľúč"] (text)
                                a [data-i18n-attr="atribút|kľúč"] (atribút)
   - Switcher: [data-lang-switch] tlačidlá s data-lang="sk|cs|en"
   - Perzistencia v localStorage pod 'sage_lang'
   - Default: <html lang="sk"> alebo browser prefer
   ========================================================================== */

(function () {
  'use strict';

  var SUPPORTED = ['sk', 'cs', 'en'];
  var STORAGE_KEY = 'sage_lang';
  var FALLBACK = 'sk';

  function detect() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || 'sk').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return FALLBACK;
  }

  function getNested(obj, path) {
    var parts = path.split('.');
    var v = obj;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return null;
      v = v[parts[i]];
    }
    return v;
  }

  function applyDict(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = getNested(dict, key);
      if (val == null) return;
      if (el.dataset.i18nHtml === 'true' || /<[a-z][\s\S]*>/i.test(val)) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split('|');
        if (p.length !== 2) return;
        var attr = p[0].trim();
        var key = p[1].trim();
        var val = getNested(dict, key);
        if (val != null) el.setAttribute(attr, val);
      });
    });
    var t = getNested(dict, 'meta.title');
    if (t) document.title = t;
    var d = getNested(dict, 'meta.description');
    if (d) {
      var m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', d);
    }
  }

  var cache = {};
  function load(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    // Prefer the inlined dict.js bundle (works on file:// and http:// alike).
    if (window.__sage_i18n && window.__sage_i18n[lang]) {
      cache[lang] = window.__sage_i18n[lang];
      return Promise.resolve(cache[lang]);
    }
    // Fallback to fetch (live development on http://).
    var path = window.SAGE_I18N_PATH || window.SITE_I18N_PATH || './i18n/';
    var url = path + lang + '.json';
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('i18n load failed: ' + url);
      return r.json();
    }).then(function (json) {
      cache[lang] = json;
      return json;
    });
  }

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) lang = FALLBACK;
    document.documentElement.lang = lang;
    if (persist !== false) localStorage.setItem(STORAGE_KEY, lang);
    document.querySelectorAll('[data-lang-switch]').forEach(function (sw) {
      sw.querySelectorAll('[data-lang]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
    });
    document.documentElement.setAttribute('data-i18n-loading', 'true');
    return load(lang).then(function (dict) {
      document.documentElement.removeAttribute('data-i18n-loading');
      applyDict(dict);
      window.dispatchEvent(new CustomEvent('sage:lang-change', { detail: { lang: lang, dict: dict } }));
    }).catch(function (err) {
      console.warn('[i18n]', err);
      if (lang !== FALLBACK) setLang(FALLBACK, false);
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang-switch] [data-lang]');
    if (!btn) return;
    e.preventDefault();
    setLang(btn.dataset.lang, true);
  });

  var initial = detect();
  setLang(initial, false);

  window.Sage = window.Sage || {};
  window.Sage.setLang = setLang;
  window.Sage.getLang = function () { return localStorage.getItem(STORAGE_KEY) || detect(); };
  window.Sage.SUPPORTED_LANGS = SUPPORTED;

  /* ───── Portfolio back badge ───── */
  var BADGE_LABELS = {
    sk: { kicker: 'UKÁŽKA · Vaša bude úplne iná', cta: 'Späť na ukážky' },
    cs: { kicker: 'UKÁZKA · Vaše bude úplně jiná', cta: 'Zpět na ukázky' },
    en: { kicker: 'DEMO · Yours will be different', cta: 'Back to demos'  }
  };

  function buildBadge() {
    if (document.getElementById('sage-demo-badge')) return;
    var a = document.createElement('a');
    a.id = 'sage-demo-badge';
    a.className = 'demo-badge';
    a.href = '../../studio/portfolio.html';
    a.setAttribute('aria-label', 'Back to Sage Studio portfolio');
    a.innerHTML =
      '<span class="demo-badge__icon" aria-hidden="true">' +
        '<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</span>' +
      '<span class="demo-badge__text">' +
        '<span class="demo-badge__kicker" data-demo-badge-kicker></span>' +
        '<span class="demo-badge__cta" data-demo-badge-cta></span>' +
      '</span>';
    document.body.appendChild(a);
    paintBadge(window.Sage.getLang());

    // Fade the badge out when the footer is in view so it never blocks footer links.
    var footer = document.querySelector('footer, .footer');
    if (footer && 'IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          a.classList.toggle('demo-badge--dim', en.isIntersecting);
        });
      }, { threshold: 0.05 });
      fio.observe(footer);
    }
  }

  function paintBadge(lang) {
    var b = document.getElementById('sage-demo-badge');
    if (!b) return;
    var labels = BADGE_LABELS[lang] || BADGE_LABELS[FALLBACK];
    var k = b.querySelector('[data-demo-badge-kicker]');
    var c = b.querySelector('[data-demo-badge-cta]');
    if (k) k.textContent = labels.kicker;
    if (c) c.textContent = labels.cta;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBadge);
  } else {
    buildBadge();
  }

  /* ───── Demo CTA banner ─────
     A "this is a demo, get yours built" banner inserted before the footer of
     every template page. Localized via Sage i18n state. */
  var CTA_LABELS = {
    sk: {
      kicker: 'UKÁŽKA · Vaša firma si zaslúži vlastný web',
      title: 'Tento web je iba ukážka',
      text: 'Pre vašu firmu pripravím vlastný — podľa toho, čo robíte a čo potrebujú vaši zákazníci. Napíšte mi a navrhnem, ako by mohol vyzerať ten váš.',
      btn: 'Napísať mi →'
    },
    cs: {
      kicker: 'UKÁZKA · Vaše firma si zaslouží vlastní web',
      title: 'Tento web je jen ukázka',
      text: 'Pro vaši firmu připravím vlastní — podle toho, co děláte a co potřebují vaši zákazníci. Napište mi a navrhnu, jak by mohl vypadat ten váš.',
      btn: 'Napsat mi →'
    },
    en: {
      kicker: 'DEMO · Your business deserves its own',
      title: 'This is just a demo',
      text: 'I\'d build something completely custom for your business — based on what you do and what your customers need. Tell me about it and I\'ll sketch what yours could look like.',
      btn: 'Write to me →'
    }
  };

  function buildCTAStyles() {
    if (document.getElementById('sage-demo-cta-styles')) return;
    var s = document.createElement('style');
    s.id = 'sage-demo-cta-styles';
    s.textContent = ''
      + '.sage-demo-cta { background:linear-gradient(135deg,#1a1815 0%,#2b2925 100%); color:#fff; padding:78px 20px; text-align:center; position:relative; overflow:hidden; border-top:1px solid rgba(255,255,255,0.06); margin:0; }'
      + '.sage-demo-cta::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(106,122,85,0.18) 0%, transparent 100%); pointer-events:none; }'
      + '.sage-demo-cta__inner { position:relative; max-width:680px; margin:0 auto; padding:0 16px; }'
      + '.sage-demo-cta__kicker { display:inline-block; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.24em; text-transform:uppercase; color:#a8b48f; margin:0 0 22px; padding:7px 16px; background:rgba(106,122,85,0.18); border:1px solid rgba(106,122,85,0.36); border-radius:999px; }'
      + '.sage-demo-cta__title { font-family:Georgia,"Times New Roman",serif; font-size:clamp(1.7rem,3.6vw,2.4rem); line-height:1.2; letter-spacing:-0.01em; color:#fff; margin:0 0 18px; font-weight:400; }'
      + '.sage-demo-cta__text { font-size:1rem; line-height:1.7; color:rgba(255,255,255,0.78); margin:0 0 34px; }'
      + '.sage-demo-cta__btn { display:inline-block; padding:14px 32px; background:#6a7a55; color:#fff !important; text-decoration:none; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size:0.95rem; font-weight:500; letter-spacing:0.02em; border-radius:999px; transition:background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease; box-shadow:0 8px 24px rgba(106,122,85,0.32); border:0; cursor:pointer; }'
      + '.sage-demo-cta__btn:hover { background:#7a8b62; transform:translateY(-2px); box-shadow:0 12px 32px rgba(106,122,85,0.42); }'
      + '@media (max-width:600px) { .sage-demo-cta { padding:58px 16px; } }';
    document.head.appendChild(s);
  }

  function buildCTA() {
    if (document.getElementById('sage-demo-cta')) return;
    var footer = document.querySelector('footer, .footer');
    if (!footer) return;
    var section = document.createElement('section');
    section.id = 'sage-demo-cta';
    section.className = 'sage-demo-cta';
    section.innerHTML = ''
      + '<div class="sage-demo-cta__inner">'
      +   '<span class="sage-demo-cta__kicker" data-cta-kicker></span>'
      +   '<h2 class="sage-demo-cta__title" data-cta-title></h2>'
      +   '<p class="sage-demo-cta__text" data-cta-text></p>'
      +   '<a class="sage-demo-cta__btn" href="../../studio/contact.html" data-cta-btn></a>'
      + '</div>';
    footer.parentNode.insertBefore(section, footer);
    paintCTA(window.Sage && window.Sage.getLang ? window.Sage.getLang() : FALLBACK);
  }

  function paintCTA(lang) {
    var s = document.getElementById('sage-demo-cta');
    if (!s) return;
    var labels = CTA_LABELS[lang] || CTA_LABELS[FALLBACK];
    var k = s.querySelector('[data-cta-kicker]');
    var t = s.querySelector('[data-cta-title]');
    var p = s.querySelector('[data-cta-text]');
    var b = s.querySelector('[data-cta-btn]');
    if (k) k.textContent = labels.kicker;
    if (t) t.textContent = labels.title;
    if (p) p.textContent = labels.text;
    if (b) b.textContent = labels.btn;
  }

  function bootCTA() {
    buildCTAStyles();
    buildCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCTA);
  } else {
    bootCTA();
  }

  window.addEventListener('sage:lang-change', function (e) {
    var lang = e.detail && e.detail.lang;
    paintBadge(lang);
    paintCTA(lang);
  });
})();
