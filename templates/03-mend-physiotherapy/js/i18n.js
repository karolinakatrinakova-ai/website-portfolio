/* ============================================================================
   STUDIO · i18n
   - Načíta i18n/<lang>.json (sk / cs / en)
   - Aplikuje preklady na elementy s [data-i18n="kľúč"] (text)
                                a [data-i18n-attr="atribút|kľúč"] (atribút)
   - Switcher: [data-lang-switch] tlačidlá s data-lang="sk|cs|en"
   - Perzistencia v localStorage pod 'petal_lang'
   - Default: <html lang="sk"> alebo browser prefer
   ========================================================================== */

(function () {
  'use strict';

  var SUPPORTED = ['sk', 'cs', 'en'];
  var STORAGE_KEY = 'petal_lang';
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
      // Allow simple HTML (we control the JSON, no XSS risk)
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
    // <title> via key 'meta.title'
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
    var url = (window.PETAL_I18N_PATH || './i18n/') + lang + '.json';
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
      window.dispatchEvent(new CustomEvent('petal:lang-change', { detail: { lang: lang, dict: dict } }));
    }).catch(function (err) {
      console.warn('[i18n]', err);
      if (lang !== FALLBACK) setLang(FALLBACK, false);
    });
  }

  // Hook switcher buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang-switch] [data-lang]');
    if (!btn) return;
    e.preventDefault();
    setLang(btn.dataset.lang, true);
  });

  // Init
  var initial = detect();
  setLang(initial, false);

  // Expose
  window.Petal = window.Petal || {};
  window.Petal.setLang = setLang;
  window.Petal.getLang = function () { return localStorage.getItem(STORAGE_KEY) || detect(); };
  window.Petal.SUPPORTED_LANGS = SUPPORTED;
})();
