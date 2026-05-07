/* ============================================================================
   SAGE STUDIO · i18n
   - Loads i18n/<lang>.json (en / sk / cs)
   - Applies translations to elements with [data-i18n="key"] (text)
                                       and [data-i18n-attr="attribute|key"]
   - Switcher: [data-lang-switch] buttons with data-lang="en|sk|cs"
   - Persists in localStorage as 'sage_lang'
   - Default: EN (with browser-language detection on first visit)
   ========================================================================== */

(function () {
  'use strict';

  var SUPPORTED = ['en', 'sk', 'cs'];
  var STORAGE_KEY = 'sage_lang';
  var FALLBACK = 'en';

  function detect() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return FALLBACK;
  }

  function getNested(obj, path) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, path)) return obj[path];
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
    var url = (window.SAGE_I18N_PATH || './i18n/') + lang + '.json';
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
    return load(lang).then(function (dict) {
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
})();
