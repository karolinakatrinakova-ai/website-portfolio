/* =============================================================================
 * Aria — Account page (My bookings & passes)
 * ===========================================================================*/
(function () {
  'use strict';
  if (!window.AriaBooking) return;
  var AB = window.AriaBooking;

  var statCredits  = document.getElementById('statCredits');
  var statUpcoming = document.getElementById('statUpcoming');
  var statAttended = document.getElementById('statAttended');
  var listUp       = document.getElementById('upcomingList');
  var listPast     = document.getElementById('pastList');
  var passesEl     = document.getElementById('passesList');
  var historyEl    = document.getElementById('historyTable');

  var dialog       = document.getElementById('confirmDialog');
  var dialogYes    = document.getElementById('confirmYes');
  var dialogNo     = document.getElementById('confirmNo');
  var dialogTitle  = document.getElementById('confirmTitle');
  var dialogText   = document.getElementById('confirmText');
  var pendingId    = null;

  var toastEl      = document.getElementById('ariaToast');
  var toastTimer   = null;

  function currentLang() {
    if (window.Sage && typeof window.Sage.getLang === 'function') return window.Sage.getLang();
    return (document.documentElement.lang || 'sk').slice(0, 2);
  }
  function i18n(key, fallback) {
    var dict = window.__sage_i18n && window.__sage_i18n[currentLang()];
    if (dict) {
      var parts = key.split('.'); var v = dict;
      for (var i = 0; i < parts.length; i++) { if (v == null) { v = null; break; } v = v[parts[i]]; }
      if (v != null && typeof v === 'string') return v;
    }
    return fallback;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function fmtDate(d) {
    var dn = ({
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      cs: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
      sk: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So']
    })[currentLang()] || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dn[d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + d.getFullYear();
  }
  function fmtDateTime(d) { return fmtDate(d) + ' · ' + AB.helpers.pad(d.getHours()) + ':' + AB.helpers.pad(d.getMinutes()); }
  function fmtRelHours(h) {
    if (h < 0) return i18n('acc.past_n', 'Past');
    if (h < 1) return Math.round(h * 60) + ' ' + i18n('acc.min', 'min');
    if (h < 48) return Math.round(h) + ' ' + i18n('acc.hours', 'h');
    return Math.round(h / 24) + ' ' + i18n('acc.days', 'days');
  }

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2400);
  }

  function bookingsWithClass() {
    return AB.bookings().map(function (b) {
      return { booking: b, klass: AB.classById(b.classId) };
    }).filter(function (x) { return x.klass; });
  }

  function render() {
    var data = bookingsWithClass();
    var now = Date.now();

    var upcoming = data.filter(function (x) { return x.booking.state !== 'cancelled' && x.klass.start.getTime() > now; })
      .sort(function (a, b) { return a.klass.start - b.klass.start; });
    var past = data.filter(function (x) { return x.klass.start.getTime() <= now || x.booking.state === 'cancelled'; })
      .sort(function (a, b) { return b.klass.start - a.klass.start; });

    statCredits.textContent  = AB.totalCredits();
    statUpcoming.textContent = upcoming.length;
    statAttended.textContent = past.filter(function (x) { return x.booking.state === 'confirmed' || x.booking.state === 'waitlist'; }).length;

    listUp.innerHTML  = upcoming.length ? upcoming.map(renderBooking).join('') : emptyState('upcoming');
    listPast.innerHTML = past.length ? past.map(renderBooking).join('') : emptyState('past');

    bindCancelButtons();
    renderPasses();
    renderHistory();
  }

  function renderBooking(x) {
    var c = x.klass; var b = x.booking;
    var t = AB.teacher(c.teacherId);
    var hToStart = (c.start.getTime() - Date.now()) / 36e5;
    var canCancel = AB.canCancel(c.id) && b.state !== 'cancelled';
    var stateLabel = ({
      confirmed:  i18n('acc.b_confirmed', 'Confirmed'),
      waitlist:   i18n('acc.b_waitlist', 'Waitlist'),
      cancelled:  i18n('acc.b_cancelled', 'Cancelled')
    })[b.state] || b.state;
    var stateCls = 'acc-card__state acc-card__state--' + b.state;
    var cls = AB.config.classTypes[c.type];

    return ''
      + '<article class="acc-card acc-card--' + c.type + (b.state === 'cancelled' ? ' is-cancelled' : '') + '">'
      +   '<div class="acc-card__date">'
      +     '<span class="acc-card__day">' + AB.helpers.pad(c.start.getDate()) + '</span>'
      +     '<span class="acc-card__mo">' + monthShort(c.start) + '</span>'
      +   '</div>'
      +   '<div class="acc-card__body">'
      +     '<div class="acc-card__top">'
      +       '<span class="acc-card__type">' + cls.name + '</span>'
      +       '<span class="' + stateCls + '">' + stateLabel + '</span>'
      +     '</div>'
      +     '<h3 class="acc-card__name">' + escapeHtml(c.name) + '</h3>'
      +     '<p class="acc-card__meta">' + fmtDateTime(c.start) + ' — ' + c.endHM + ' · ' + escapeHtml(t.name) + ' · ' + escapeHtml(c.room) + '</p>'
      +     (b.state !== 'cancelled' && hToStart > 0
        ? '<p class="acc-card__count">' + i18n('acc.in', 'In') + ' ' + fmtRelHours(hToStart) + '</p>'
        : '')
      +   '</div>'
      +   '<div class="acc-card__actions">'
      +     (b.state !== 'cancelled' && hToStart > 0
        ? '<button class="btn-pill btn-pill--ghost btn-pill--danger" type="button" data-cancel="' + b.id + '" ' + (canCancel ? '' : 'disabled') + '>'
          + (canCancel ? i18n('acc.cancel', 'Cancel') : i18n('acc.too_late', 'Too late to cancel'))
          + '</button>'
        : '')
      +   '</div>'
      + '</article>';
  }

  function emptyState(which) {
    if (which === 'upcoming') {
      return '<div class="acc-empty"><i class="fa-regular fa-calendar"></i>'
        + '<h3>' + i18n('acc.empty_up_t', 'No upcoming classes') + '</h3>'
        + '<p>' + i18n('acc.empty_up_l', 'Browse the schedule and book your next class.') + '</p>'
        + '<a href="schedule.html" class="btn-pill btn-pill--solid">' + i18n('acc.empty_up_cta', 'Open schedule →') + '</a></div>';
    }
    return '<div class="acc-empty acc-empty--soft"><p>' + i18n('acc.empty_past', 'Your past classes will appear here.') + '</p></div>';
  }

  function monthShort(d) {
    var m = ({
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      cs: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
      sk: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
    })[currentLang()] || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return m[d.getMonth()];
  }

  function bindCancelButtons() {
    document.querySelectorAll('[data-cancel]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pendingId = btn.dataset.cancel;
        dialog.classList.add('is-open');
        dialog.setAttribute('aria-hidden', 'false');
      });
    });
  }

  function renderPasses() {
    var p = AB.passes();
    var active = p.items.filter(function (it) { return (!it.expires || it.expires > Date.now()) && it.creditsLeft > 0; });
    if (!active.length) {
      passesEl.innerHTML = '<div class="acc-empty acc-empty--soft">'
        + '<h3>' + i18n('acc.no_pass_t', 'No active pass') + '</h3>'
        + '<p>' + i18n('acc.no_pass_l', 'Buy a pass to book classes faster and save on the per-class price.') + '</p>'
        + '<a href="checkout.html" class="btn-pill btn-pill--solid">' + i18n('acc.buy_pass', 'Buy a pass →') + '</a></div>';
      return;
    }
    passesEl.innerHTML = active.map(function (it) {
      var name = escapeHtml(it.name);
      var expires = it.expires ? fmtDate(new Date(it.expires)) : '—';
      var pct = it.creditsLeft > 999 ? 100 : Math.min(100, Math.round((it.creditsLeft / Math.max(1, getOriginalCredits(it))) * 100));
      return '<article class="acc-pass">'
        + '<div class="acc-pass__head"><h3>' + name + '</h3><span class="acc-pass__credits">' + (it.creditsLeft > 999 ? '∞' : it.creditsLeft) + '</span></div>'
        + '<div class="acc-pass__bar"><span style="width:' + pct + '%"></span></div>'
        + '<p class="acc-pass__exp">' + i18n('acc.valid_until', 'Valid until') + ' ' + expires + '</p>'
        + '</article>';
    }).join('');
  }

  function getOriginalCredits(it) {
    var pass = AB.config.passes.filter(function (p) { return p.id === it.passId; })[0];
    return pass ? pass.credits : it.creditsLeft;
  }

  function renderHistory() {
    var p = AB.passes();
    var rows = p.items.slice().sort(function (a, b) { return b.purchasedAt - a.purchasedAt; });
    var tbody = historyEl.querySelector('tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="acc-history__empty">' + i18n('acc.no_history', 'No purchases yet.') + '</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(function (it) {
      return '<tr>'
        + '<td>' + fmtDate(new Date(it.purchasedAt)) + '</td>'
        + '<td>' + escapeHtml(it.name) + '</td>'
        + '<td>' + (it.creditsLeft > 999 ? '∞' : it.creditsLeft) + '</td>'
        + '<td>' + (it.priceCzk ? it.priceCzk + ' Kč' : '—') + '</td>'
        + '</tr>';
    }).join('');
  }

  // ─────────────────── Tabs ───────────────────
  document.querySelectorAll('.acc-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.dataset.tab;
      document.querySelectorAll('.acc-tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
      document.querySelectorAll('.acc-pane').forEach(function (p) { p.classList.toggle('is-active', p.dataset.pane === name); });
    });
  });

  // ─────────────────── Confirm dialog ───────────────────
  dialogNo && dialogNo.addEventListener('click', closeDialog);
  dialog && dialog.addEventListener('click', function (e) { if (e.target === dialog) closeDialog(); });
  dialogYes && dialogYes.addEventListener('click', function () {
    if (!pendingId) return closeDialog();
    var r = AB.cancel(pendingId);
    closeDialog();
    if (r.ok) { toast(i18n('acc.cancelled_ok', 'Booking cancelled — credit refunded.')); }
    else { toast(({ too_late: i18n('err.too_late', 'You can only cancel more than 4 hours before the start.'), not_found: i18n('err.not_found', 'Booking not found.') })[r.error] || r.error); }
  });
  function closeDialog() {
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');
    pendingId = null;
  }

  AB.subscribe(render);
  window.addEventListener('sage:lang-change', render);
  setInterval(render, 60000);
  render();
})();
