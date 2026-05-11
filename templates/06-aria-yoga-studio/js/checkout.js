/* =============================================================================
 * Aria — Checkout / pass purchase
 * ===========================================================================*/
(function () {
  'use strict';
  if (!window.AriaBooking) return;
  var AB = window.AriaBooking;

  var grid     = document.getElementById('passGrid');
  var pay      = document.getElementById('chkPay');
  var btnClose = document.getElementById('chkClose');
  var payHead  = document.getElementById('payHead');
  var paySub   = document.getElementById('paySub');
  var paySubmit = document.getElementById('paySubmit');
  var payTag   = document.getElementById('payTag');
  var doneSub  = document.getElementById('doneSub');
  var payForm  = document.getElementById('payForm');
  var toastEl  = document.getElementById('ariaToast');
  var pending  = null;
  var toastTimer;

  function currentLang() { return (window.Sage && window.Sage.getLang()) || 'sk'; }
  function i18n(key, fb) {
    var dict = window.__sage_i18n && window.__sage_i18n[currentLang()];
    if (dict) {
      var parts = key.split('.'); var v = dict;
      for (var i = 0; i < parts.length; i++) { if (v == null) { v = null; break; } v = v[parts[i]]; }
      if (v != null && typeof v === 'string') return v;
    }
    return fb;
  }
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2400);
  }
  function setStep(name) {
    pay.querySelectorAll('.book-modal__step').forEach(function (s) {
      s.classList.toggle('is-active', s.dataset.step === name);
    });
  }

  // ─────────────────── Pass cards ───────────────────
  function render() {
    grid.innerHTML = AB.config.passes.map(function (p, idx) {
      var feat = p.id === 'p10' || p.badge ? ' chk-pass--feat' : '';
      var unlimited = p.credits >= 999;
      var perClass = !unlimited && p.credits > 1 ? Math.round(p.priceCzk / p.credits) : null;
      var creditsLine = unlimited
        ? i18n('chk.unlimited', 'Unlimited classes')
        : (p.credits === 1 ? i18n('chk.one_class', '1 class') : p.credits + ' ' + i18n('chk.classes', 'classes'));
      return '<article class="chk-pass' + feat + '">'
        + (p.badge ? '<span class="chk-pass__badge">' + i18n('chk.badge_' + p.id, p.badge) + '</span>' : '')
        + '<h3>' + i18n('chk.pass_' + p.id + '_name', p.name) + '</h3>'
        + '<p class="chk-pass__desc">' + i18n('chk.pass_' + p.id + '_desc', p.desc) + '</p>'
        + '<div class="chk-pass__price">'
        +   '<strong>' + p.priceCzk + ' Kč</strong>'
        + '</div>'
        + '<ul class="chk-pass__feat">'
        +   '<li><i class="fa-solid fa-check"></i> ' + creditsLine + '</li>'
        +   (p.validDays ? '<li><i class="fa-solid fa-check"></i> ' + i18n('chk.valid', 'Valid') + ' ' + p.validDays + ' ' + i18n('chk.days', 'days') + '</li>' : '<li><i class="fa-solid fa-check"></i> ' + i18n('chk.no_expiry', 'No expiry') + '</li>')
        +   (perClass ? '<li><i class="fa-solid fa-check"></i> ~' + perClass + ' Kč / ' + i18n('chk.per_class', 'class') + '</li>' : '')
        +   '<li><i class="fa-solid fa-check"></i> ' + i18n('chk.cancel_4h', 'Free cancellation up to 4 h before') + '</li>'
        + '</ul>'
        + '<button class="btn-pill btn-pill--solid chk-pass__cta" data-pass="' + p.id + '">' + i18n('chk.buy', 'Buy this pass') + '</button>'
        + '</article>';
    }).join('');

    grid.querySelectorAll('[data-pass]').forEach(function (btn) {
      btn.addEventListener('click', function () { startPurchase(btn.dataset.pass); });
    });
  }

  function startPurchase(passId) {
    var p = AB.config.passes.filter(function (x) { return x.id === passId; })[0];
    if (!p) return;
    pending = p;
    payTag.textContent = i18n('chk.tag_purchase', 'Purchase');
    payHead.textContent = i18n('chk.pass_' + p.id + '_name', p.name);
    paySub.textContent = i18n('chk.pass_' + p.id + '_desc', p.desc);
    paySubmit.querySelector('span').textContent = i18n('pay.submit_amount', 'Pay') + ' ' + p.priceCzk + ' Kč';
    setStep('pay');
    pay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePay() {
    pay.classList.remove('is-open');
    document.body.style.overflow = '';
    pending = null;
  }
  btnClose.addEventListener('click', closePay);
  pay.addEventListener('click', function (e) { if (e.target === pay) closePay(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pay.classList.contains('is-open')) closePay();
  });

  // ─────────────────── Card-input formatting ───────────────────
  var inpNumber = payForm.querySelector('input[name="number"]');
  var inpExp    = payForm.querySelector('input[name="exp"]');
  inpNumber.addEventListener('input', function () {
    var raw = inpNumber.value.replace(/\D/g, '').slice(0, 16);
    inpNumber.value = raw.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  });
  inpExp.addEventListener('input', function () {
    var raw = inpExp.value.replace(/\D/g, '').slice(0, 4);
    inpExp.value = raw.length > 2 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw;
  });

  payForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!pending) return;
    var data = new FormData(payForm);
    var num = String(data.get('number') || '').replace(/\s+/g, '');
    var exp = String(data.get('exp') || '');
    var cvc = String(data.get('cvc') || '');
    var holder = String(data.get('holder') || '').trim();
    var email = String(data.get('email') || '').trim();
    var validEmail = /.+@.+\..+/.test(email);
    var ok = holder.length > 1 && num.length >= 13 && /^\d{2}\/\d{2}$/.test(exp) && cvc.length >= 3 && validEmail;
    if (!ok) { toast(i18n('pay.invalid', 'Please check the details.')); return; }
    setStep('threeds');
    setTimeout(function () {
      var r = AB.purchase(pending.id, { method: 'card', last4: num.slice(-4) });
      if (!r.ok) { toast(i18n('err.payment', 'Payment failed. Try another card.')); setStep('pay'); return; }
      var u = AB.user(); u.email = email; u.name = holder; AB.setUser(u);
      doneSub.textContent = pending.name + ' · ' + pending.priceCzk + ' Kč';
      setStep('done');
    }, 1400);
  });

  render();
  window.addEventListener('sage:lang-change', render);
})();
