/* =============================================================================
 * Aria — Schedule page renderer + booking-flow controller
 * ===========================================================================*/
(function () {
  'use strict';
  if (!window.AriaBooking) return;
  var AB = window.AriaBooking;

  // ─────────────────── DOM ───────────────────
  var grid       = document.getElementById('schedGrid');
  var weekLabel  = document.getElementById('weekLabel');
  var btnPrev    = document.getElementById('weekPrev');
  var btnNext    = document.getElementById('weekNext');
  var btnToday   = document.getElementById('weekToday');
  var btnReset   = document.getElementById('filterReset');
  var fType      = document.getElementById('filterType');
  var fTeacher   = document.getElementById('filterTeacher');
  var fRoom      = document.getElementById('filterRoom');
  var fLang      = document.getElementById('filterLang');
  var navAccount = document.getElementById('navAccount');
  if (!grid) return;

  // ─────────────────── Filter dropdowns ───────────────────
  AB.config.teachers.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t.id; o.textContent = t.name;
    fTeacher.appendChild(o);
  });
  AB.config.rooms.forEach(function (r, i) {
    var o = document.createElement('option');
    o.value = String(i); o.textContent = r;
    fRoom.appendChild(o);
  });

  // ─────────────────── State ───────────────────
  var state = {
    weekOffset: 0, // 0 = current week
    filter: { type: '', teacher: '', room: '', lang: '' }
  };

  // ─────────────────── Helpers ───────────────────
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function weekStartFor(offset) {
    var monday = AB.helpers.startOfWeek(new Date());
    monday.setDate(monday.getDate() + offset * 7);
    return monday;
  }

  function currentLang() {
    if (window.Sage && typeof window.Sage.getLang === 'function') return window.Sage.getLang();
    return (document.documentElement.lang || 'sk').slice(0, 2);
  }

  function fmtMonthDay(d, lang) {
    var months = {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      cs: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
      sk: ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec']
    };
    var m = months[lang] || months.en;
    return d.getDate() + '. ' + m[d.getMonth()];
  }

  function weekLabelText(weekStart) {
    var lang = currentLang();
    var end = new Date(weekStart); end.setDate(end.getDate() + 6);
    return fmtMonthDay(weekStart, lang) + ' — ' + fmtMonthDay(end, lang) + ' ' + end.getFullYear();
  }

  // ─────────────────── Rendering ───────────────────
  function render() {
    var lang = currentLang();
    var weekStart = weekStartFor(state.weekOffset);
    var weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);
    weekLabel.textContent = weekLabelText(weekStart);
    btnToday.classList.toggle('is-active', state.weekOffset === 0);

    var all = AB.instances().filter(function (c) {
      return c.start >= weekStart && c.start < weekEnd;
    });

    // filters
    var f = state.filter;
    var classes = all.filter(function (c) {
      if (f.type && c.type !== f.type) return false;
      if (f.teacher && c.teacherId !== f.teacher) return false;
      if (f.room !== '' && AB.config.rooms.indexOf(c.room) !== Number(f.room)) return false;
      if (f.lang && c.lang !== f.lang) return false;
      return true;
    });

    // group by day-of-week (Mon..Sun)
    var cols = [[], [], [], [], [], [], []];
    classes.forEach(function (c) {
      var dayIdx = c.start.getDay();          // 0..6 Sun..Sat
      var col = dayIdx === 0 ? 6 : dayIdx - 1; // Mon..Sun
      cols[col].push(c);
    });
    cols.forEach(function (arr) { arr.sort(function (a, b) { return a.start - b.start; }); });

    // build grid HTML
    var html = '';
    var dayNamesLong = {
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      cs: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
      sk: ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa']
    };
    var dnames = dayNamesLong[lang] || dayNamesLong.en;

    var today = new Date(); today.setHours(0, 0, 0, 0);
    for (var d = 0; d < 7; d++) {
      var date = new Date(weekStart); date.setDate(date.getDate() + d);
      var isToday = date.getTime() === today.getTime();
      html += '<div class="sched-col' + (isToday ? ' is-today' : '') + '">';
      html += '<div class="sched-col__head"><span>' + dnames[d] + '</span><strong>' + date.getDate() + '. ' + (date.getMonth() + 1) + '.</strong></div>';
      html += '<div class="sched-col__body">';
      if (cols[d].length === 0) {
        html += '<div class="sched-col__empty">—</div>';
      } else {
        cols[d].forEach(function (c) { html += renderCell(c); });
      }
      html += '</div></div>';
    }
    if (classes.length === 0) {
      html += '<div class="sched-empty"><i class="fa-regular fa-face-smile"></i><p>' + i18n('sched.no_results', 'Nothing matches these filters yet — try removing one.') + '</p></div>';
    }
    grid.innerHTML = html;

    // attach click handlers
    grid.querySelectorAll('.sched-cell').forEach(function (cell) {
      cell.addEventListener('click', function () { openModal(cell.dataset.id); });
    });

    updateAccountChip();
  }

  function renderCell(c) {
    var st = AB.status(c);
    var t = AB.teacher(c.teacherId);
    var typeName = AB.config.classTypes[c.type].name;
    var fillPct = Math.min(100, Math.round((st.taken / st.capacity) * 100));
    var stateClass = 'sched-cell--' + c.type + ' is-' + st.state;
    if (st.mine) stateClass += ' is-mine';
    if (st.isPast) stateClass += ' is-past';
    var label = st.spotsLeft > 0
      ? st.spotsLeft + ' / ' + c.capacity
      : (st.state === 'waitlist' ? i18n('sched.waitlist', 'Waitlist') : i18n('sched.full', 'Full'));

    return ''
      + '<button class="sched-cell ' + stateClass + '" type="button" data-id="' + c.id + '">'
      +   '<div class="sched-cell__time">' + c.startHM + ' <span>· ' + c.duration + '\u2032</span></div>'
      +   '<div class="sched-cell__name">' + escapeHtml(c.name) + '</div>'
      +   '<div class="sched-cell__teacher">' + escapeHtml(t.name.split(' ')[0]) + ' · ' + (c.lang || 'cs').toUpperCase() + '</div>'
      +   '<div class="sched-cell__cap"><div class="sched-cell__capbar"><span style="width:' + fillPct + '%"></span></div><span class="sched-cell__caplab">' + label + '</span></div>'
      +   (st.mine ? '<span class="sched-cell__mine"><i class="fa-solid fa-check"></i></span>' : '')
      + '</button>';
  }

  function updateAccountChip() {
    if (!navAccount) return;
    var bookings = AB.bookings().filter(function (b) {
      if (b.state === 'cancelled') return false;
      var c = AB.classById(b.classId);
      return c && c.start.getTime() > Date.now();
    });
    if (bookings.length > 0) {
      navAccount.classList.add('has-badge');
      navAccount.dataset.badge = bookings.length;
    } else {
      navAccount.classList.remove('has-badge');
      delete navAccount.dataset.badge;
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function i18n(key, fallback) {
    var lang = currentLang();
    var dict = window.__sage_i18n && window.__sage_i18n[lang];
    if (dict) {
      var parts = key.split('.');
      var v = dict;
      for (var i = 0; i < parts.length; i++) {
        if (v == null) { v = null; break; }
        v = v[parts[i]];
      }
      if (v != null && typeof v === 'string') return v;
    }
    return fallback;
  }

  // ─────────────────── Booking modal ───────────────────
  var modal       = document.getElementById('bookModal');
  var btnClose    = document.getElementById('bookClose');
  var btnUseCred  = document.getElementById('btnUseCredit');
  var btnPay      = document.getElementById('btnPay');
  var doneClose   = document.getElementById('doneClose');
  var payForm     = document.getElementById('payForm');
  var paySubmit   = document.getElementById('paySubmit');
  var paySummary  = document.getElementById('paySummary');
  var creditCount = document.getElementById('creditCount');
  var modalAlt    = document.getElementById('modalAlt');
  var current     = null;

  function setStep(name) {
    modal.querySelectorAll('.book-modal__step').forEach(function (s) {
      s.classList.toggle('is-active', s.dataset.step === name);
    });
  }

  function openModal(classId) {
    var c = AB.classById(classId);
    if (!c) return;
    current = c;
    var st = AB.status(c);
    var t = AB.teacher(c.teacherId);

    document.getElementById('modalType').textContent = AB.config.classTypes[c.type].name;
    document.getElementById('modalType').className = 'book-modal__type book-modal__type--' + c.type;
    document.getElementById('modalName').textContent = c.name;
    document.getElementById('modalMeta').textContent = formatWhen(c) + ' · ' + c.duration + ' min';
    document.getElementById('modalTeacher').textContent = t.name;
    document.getElementById('modalRoom').textContent = c.room;
    document.getElementById('modalLevel').textContent = levelLabel(c.level);
    document.getElementById('modalLang').textContent = (c.lang || 'cs').toUpperCase();
    document.getElementById('modalPrice').textContent = AB.config.dropInPriceCzk + ' Kč';

    var capFill = document.getElementById('modalCapFill');
    var capText = document.getElementById('modalCapText');
    var capState = document.getElementById('modalCapState');
    var pct = Math.min(100, Math.round((st.taken / st.capacity) * 100));
    capFill.style.width = pct + '%';
    capFill.className = 'book-modal__capfill is-' + st.state;
    capText.textContent = st.taken + ' / ' + st.capacity + ' ' + i18n('modal.spots_taken', 'spots taken');
    capState.textContent = stateLabel(st.state);
    capState.className = 'book-modal__capstate is-' + st.state;

    var credits = AB.totalCredits();
    creditCount.textContent = credits;
    btnUseCred.disabled = (credits <= 0) || st.mine || st.isPast;
    btnPay.disabled = st.mine || st.isPast;
    var payBtnTxt = st.state === 'waitlist' || st.state === 'full' ? i18n('modal.join_waitlist', 'Join waitlist & pay') : i18n('modal.pay', 'Pay & book');
    btnPay.textContent = payBtnTxt;

    if (st.mine) {
      modalAlt.textContent = i18n('modal.already', 'You\'re already booked into this class.');
      btnPay.disabled = true; btnUseCred.disabled = true;
    } else if (st.isPast) {
      modalAlt.textContent = i18n('modal.past', 'This class has already finished.');
    } else if (st.state === 'waitlist') {
      modalAlt.textContent = i18n('modal.waitlist_note', 'Class is full — you\'ll be on the waitlist. Charged only if a spot opens.');
    } else {
      modalAlt.textContent = '';
    }

    setStep('details');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    current = null;
    render();
  }

  function levelLabel(l) {
    var d = { 1: i18n('modal.lvl1', 'All levels'), 2: i18n('modal.lvl2', 'Open level'), 3: i18n('modal.lvl3', 'Strong / 2+ years') };
    return d[l] || '—';
  }
  function stateLabel(s) {
    return ({
      open:    i18n('sched.s_open', 'Open'),
      filling: i18n('sched.s_filling', 'Filling'),
      almost:  i18n('sched.s_almost', 'Almost full'),
      waitlist: i18n('sched.s_waitlist', 'Waitlist'),
      full:    i18n('sched.s_full', 'Full')
    })[s] || s;
  }

  function formatWhen(c) {
    var lang = currentLang();
    var dn = ({
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      cs: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
      sk: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So']
    })[lang] || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dn[c.start.getDay()] + ' ' + c.start.getDate() + '. ' + (c.start.getMonth() + 1) + '. · ' + c.startHM + ' — ' + c.endHM;
  }

  // ─────────────────── Booking flow ───────────────────
  btnClose && btnClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
  modal.querySelectorAll('[data-back]').forEach(function (b) { b.addEventListener('click', function () { setStep('details'); }); });

  btnUseCred && btnUseCred.addEventListener('click', function () {
    if (!current) return;
    var r = AB.book(current.id, { useCredit: true });
    if (!r.ok) { toast(errorMessage(r.error)); return; }
    showDone(r);
  });

  btnPay && btnPay.addEventListener('click', function () {
    if (!current) return;
    paySummary.textContent = current.name + ' · ' + formatWhen(current);
    paySubmit.querySelector('span').textContent = i18n('pay.submit_amount', 'Pay') + ' ' + AB.config.dropInPriceCzk + ' Kč';
    setStep('pay');
  });

  payForm && payForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(payForm);
    var num = String(data.get('number') || '').replace(/\s+/g, '');
    var exp = String(data.get('exp') || '');
    var cvc = String(data.get('cvc') || '');
    var holder = String(data.get('holder') || '').trim();
    var ok = holder.length > 1 && num.length >= 13 && /^\d{2}\/\d{2}$/.test(exp) && cvc.length >= 3;
    if (!ok) {
      toast(i18n('pay.invalid', 'Please check the card details.'));
      return;
    }
    setStep('threeds');
    setTimeout(function () {
      if (!current) return;
      var r = AB.book(current.id, { payment: { method: 'card', last4: num.slice(-4) } });
      if (!r.ok) { toast(errorMessage(r.error)); setStep('details'); return; }
      showDone(r);
    }, 1400);
  });

  // Card-input formatting (autoformat number + expiry)
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

  function showDone(result) {
    var c = current; if (!c) return;
    var t = AB.teacher(c.teacherId);
    var cancelUntil = new Date(c.start.getTime() - AB.config.cancelWindowHours * 36e5);
    document.getElementById('doneTitle').textContent = result.waitlist
      ? i18n('done.waitlist', 'You\'re on the waitlist.')
      : i18n('done.title', 'You\'re booked.');
    document.getElementById('doneSummary').textContent = c.name + ' · ' + formatWhen(c);
    document.getElementById('doneTeacher').textContent = t.name;
    document.getElementById('doneRoom').textContent = c.room;
    document.getElementById('doneCancelUntil').textContent =
      cancelUntil.getDate() + '. ' + (cancelUntil.getMonth() + 1) + '. · ' +
      AB.helpers.pad(cancelUntil.getHours()) + ':' + AB.helpers.pad(cancelUntil.getMinutes());
    setStep('done');
  }

  doneClose && doneClose.addEventListener('click', closeModal);

  function errorMessage(code) {
    return ({
      not_found:  i18n('err.not_found', 'Class not found.'),
      already:    i18n('err.already', 'You\'re already booked.'),
      past:       i18n('err.past', 'This class has already finished.'),
      no_credit:  i18n('err.no_credit', 'You don\'t have any credits left — buy a pass first.'),
      no_payment: i18n('err.no_payment', 'Choose a payment method.'),
      too_late:   i18n('err.too_late', 'You can only cancel more than 4 hours before the start.')
    })[code] || code;
  }

  // ─────────────────── Toast ───────────────────
  var toastEl = document.getElementById('ariaToast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2400);
  }

  // ─────────────────── Toolbar wiring ───────────────────
  btnPrev.addEventListener('click', function () { state.weekOffset--; render(); });
  btnNext.addEventListener('click', function () { state.weekOffset++; render(); });
  btnToday.addEventListener('click', function () { state.weekOffset = 0; render(); });
  [fType, fTeacher, fRoom, fLang].forEach(function (sel) {
    sel.addEventListener('change', function () {
      state.filter[sel.id.replace('filter', '').toLowerCase()] = sel.value;
      render();
    });
  });
  btnReset.addEventListener('click', function () {
    state.filter = { type: '', teacher: '', room: '', lang: '' };
    fType.value = ''; fTeacher.value = ''; fRoom.value = ''; fLang.value = '';
    render();
  });

  AB.subscribe(render);
  // Live updates: re-render every 60s (capacity changes, status flips past/upcoming)
  setInterval(render, 60000);

  window.addEventListener('sage:lang-change', render);

  render();
})();
