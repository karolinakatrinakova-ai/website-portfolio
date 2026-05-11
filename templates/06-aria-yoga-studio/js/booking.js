/* =============================================================================
 * Aria — Smart booking system
 * -----------------------------------------------------------------------------
 * Self-contained, no backend required. All state lives in localStorage and
 * is exposed on `window.AriaBooking`. Behaviour roughly mirrors a real studio:
 *
 *  • Weekly recurring class catalog, generated for ±4 weeks around today.
 *  • Capacity per class (12 — 24 mats) tracked per session-id.
 *  • "Other students" fill seats over time, deterministic per session +
 *    a small random drift on each pageload to feel live.
 *  • Bookings persisted in localStorage. Cancel allowed up to the studio's
 *    cancellation window (default 4 hours before start) — beyond that the
 *    spot is "no-show" and credit is forfeited.
 *  • Credits & passes (intro / 5-pack / 10-pack / unlimited month).
 *  • Card-flow + 3DS step is fully simulated client-side.
 *  • Light pub/sub so the schedule, header chip, account page all stay in sync.
 * ===========================================================================*/

(function (global) {
  'use strict';

  // ─────────────────── Storage keys ───────────────────
  var KEY_BOOKINGS = 'aria_bookings_v1';
  var KEY_PASSES   = 'aria_passes_v1';
  var KEY_USER     = 'aria_user_v1';
  var KEY_DRIFT    = 'aria_drift_v1';

  // ─────────────────── Studio config ───────────────────
  var CFG = {
    cancelWindowHours: 4,           // class can be cancelled up to N h before start
    waitlistMax: 4,                 // people allowed on a waitlist after capacity
    dropInPriceCzk: 320,
    dropInPriceEur: 13,
    rooms: ['Studio Sun', 'Studio Moon'],
    teachers: [
      { id: 'eva',    name: 'Eva Hovorková',    bio: 'Vinyasa & yin · 12 yrs',  langs: ['cs', 'en'] },
      { id: 'marek',  name: 'Marek Doležal',    bio: 'Vinyasa & power · 9 yrs', langs: ['cs', 'en'] },
      { id: 'lucia',  name: 'Lucia Krajčí',     bio: 'Pilates · physio bg.',    langs: ['sk', 'cs', 'en'] },
      { id: 'anna',   name: 'Anna Hoffman',     bio: 'Breath & meditation',     langs: ['cs', 'en'] },
      { id: 'sara',   name: 'Sára Beránková',   bio: 'Vinyasa · prenatal',      langs: ['cs', 'en'] },
      { id: 'tom',    name: 'Tomáš Vítek',      bio: 'Power · ashtanga',        langs: ['cs', 'en'] }
    ],
    classTypes: {
      vin: { id: 'vin', name: 'Vinyasa',     dur: 60, capacity: 18, dot: '#7a8c6e' },
      yin: { id: 'yin', name: 'Yin',         dur: 75, capacity: 18, dot: '#c98855' },
      pil: { id: 'pil', name: 'Pilates',     dur: 60, capacity: 14, dot: '#c58e85' },
      bre: { id: 'bre', name: 'Breath',      dur: 45, capacity: 16, dot: '#b6a079' },
      pwr: { id: 'pwr', name: 'Power flow',  dur: 60, capacity: 18, dot: '#a0552c' },
      med: { id: 'med', name: 'Meditation',  dur: 30, capacity: 16, dot: '#8d8676' },
      pre: { id: 'pre', name: 'Prenatal',    dur: 60, capacity: 12, dot: '#bda3c0' }
    },
    passes: [
      { id: 'drop',  name: 'Drop-in',          credits: 1,  priceCzk: 320,  priceEur: 13,  desc: 'One class' },
      { id: 'intro', name: 'Intro week',       credits: 7,  priceCzk: 590,  priceEur: 25,  desc: '7 days unlimited · new students', badge: 'Best for first-timers', validDays: 7 },
      { id: 'p5',    name: '5-class pass',     credits: 5,  priceCzk: 1450, priceEur: 60,  desc: 'Valid 90 days', validDays: 90 },
      { id: 'p10',   name: '10-class pass',    credits: 10, priceCzk: 2700, priceEur: 112, desc: 'Valid 180 days · save 16 %', validDays: 180, badge: 'Most popular' },
      { id: 'unl',   name: 'Unlimited month',  credits: 999, priceCzk: 2990, priceEur: 124, desc: 'All classes, 30 days', validDays: 30 }
    ]
  };

  // ─────────────────── Weekly template (a "real" schedule) ───────────────────
  // dow: 0=Sun … 6=Sat   ·   times in 24h "HH:MM"
  var TEMPLATE = [
    // Monday
    { dow: 1, start: '07:00', type: 'vin', name: 'Sunrise Slow Flow',  teacher: 'eva',   room: 0, level: 1, lang: 'cs' },
    { dow: 1, start: '08:30', type: 'pil', name: 'Mat Pilates',        teacher: 'lucia', room: 1, level: 2, lang: 'sk' },
    { dow: 1, start: '09:30', type: 'vin', name: 'Open Flow',          teacher: 'marek', room: 0, level: 2, lang: 'en' },
    { dow: 1, start: '12:15', type: 'bre', name: 'Lunch Breath',       teacher: 'anna',  room: 1, level: 1, lang: 'cs' },
    { dow: 1, start: '17:00', type: 'pre', name: 'Prenatal yoga',      teacher: 'sara',  room: 1, level: 1, lang: 'cs' },
    { dow: 1, start: '18:00', type: 'pwr', name: 'Power Flow',         teacher: 'tom',   room: 0, level: 3, lang: 'en' },
    { dow: 1, start: '19:30', type: 'yin', name: 'Long Yin',           teacher: 'eva',   room: 0, level: 1, lang: 'cs' },
    { dow: 1, start: '20:00', type: 'med', name: 'Evening Meditation', teacher: 'anna',  room: 1, level: 1, lang: 'cs' },

    // Tuesday
    { dow: 2, start: '07:15', type: 'vin', name: 'Wake-up Flow',       teacher: 'marek', room: 0, level: 2, lang: 'cs' },
    { dow: 2, start: '08:30', type: 'vin', name: 'Vinyasa Open',       teacher: 'eva',   room: 0, level: 2, lang: 'en' },
    { dow: 2, start: '09:00', type: 'pil', name: 'Pilates Foundations', teacher: 'lucia', room: 1, level: 1, lang: 'sk' },
    { dow: 2, start: '12:15', type: 'pil', name: 'Pilates Express',    teacher: 'lucia', room: 1, level: 2, lang: 'cs' },
    { dow: 2, start: '17:30', type: 'pwr', name: 'Power Flow',         teacher: 'tom',   room: 0, level: 3, lang: 'en' },
    { dow: 2, start: '18:00', type: 'yin', name: 'Yin & Restore',      teacher: 'eva',   room: 1, level: 1, lang: 'cs' },
    { dow: 2, start: '19:30', type: 'vin', name: 'Slow Flow',          teacher: 'marek', room: 0, level: 2, lang: 'cs' },
    { dow: 2, start: '20:30', type: 'bre', name: 'Pranayama',          teacher: 'anna',  room: 1, level: 1, lang: 'cs' },

    // Wednesday
    { dow: 3, start: '07:00', type: 'vin', name: 'Sunrise Flow',       teacher: 'sara',  room: 0, level: 2, lang: 'cs' },
    { dow: 3, start: '08:30', type: 'pil', name: 'Mat Pilates',        teacher: 'lucia', room: 1, level: 2, lang: 'sk' },
    { dow: 3, start: '10:00', type: 'pre', name: 'Prenatal yoga',      teacher: 'sara',  room: 1, level: 1, lang: 'cs' },
    { dow: 3, start: '12:15', type: 'bre', name: 'Lunch Breath',       teacher: 'anna',  room: 1, level: 1, lang: 'cs' },
    { dow: 3, start: '17:00', type: 'vin', name: 'After-work Flow',    teacher: 'eva',   room: 0, level: 2, lang: 'cs' },
    { dow: 3, start: '18:00', type: 'pwr', name: 'Power Flow',         teacher: 'marek', room: 0, level: 3, lang: 'en' },
    { dow: 3, start: '19:30', type: 'med', name: 'Evening Meditation', teacher: 'anna',  room: 1, level: 1, lang: 'cs' },
    { dow: 3, start: '19:30', type: 'yin', name: 'Yin Hips',           teacher: 'eva',   room: 0, level: 1, lang: 'en' },

    // Thursday
    { dow: 4, start: '07:15', type: 'pil', name: 'Pilates Strong',     teacher: 'lucia', room: 1, level: 3, lang: 'sk' },
    { dow: 4, start: '08:30', type: 'vin', name: 'Vinyasa Open',       teacher: 'eva',   room: 0, level: 2, lang: 'en' },
    { dow: 4, start: '09:30', type: 'yin', name: 'Yin & Restore',      teacher: 'sara',  room: 1, level: 1, lang: 'cs' },
    { dow: 4, start: '12:15', type: 'pil', name: 'Pilates Express',    teacher: 'lucia', room: 1, level: 2, lang: 'cs' },
    { dow: 4, start: '17:30', type: 'vin', name: 'Slow Flow',          teacher: 'marek', room: 0, level: 1, lang: 'cs' },
    { dow: 4, start: '18:00', type: 'yin', name: 'Long Yin',           teacher: 'eva',   room: 1, level: 1, lang: 'cs' },
    { dow: 4, start: '19:30', type: 'pwr', name: 'Power Flow',         teacher: 'tom',   room: 0, level: 3, lang: 'en' },

    // Friday
    { dow: 5, start: '07:00', type: 'vin', name: 'Sunrise Flow',       teacher: 'sara',  room: 0, level: 2, lang: 'cs' },
    { dow: 5, start: '08:30', type: 'pil', name: 'Mat Pilates',        teacher: 'lucia', room: 1, level: 2, lang: 'sk' },
    { dow: 5, start: '12:15', type: 'bre', name: 'Lunch Breath',       teacher: 'anna',  room: 1, level: 1, lang: 'cs' },
    { dow: 5, start: '17:00', type: 'pwr', name: 'TGIF Power Flow',    teacher: 'tom',   room: 0, level: 3, lang: 'en' },
    { dow: 5, start: '18:00', type: 'yin', name: 'Friday Yin',         teacher: 'eva',   room: 1, level: 1, lang: 'cs' },
    { dow: 5, start: '19:30', type: 'med', name: 'Sound bath',         teacher: 'anna',  room: 0, level: 1, lang: 'cs' },

    // Saturday
    { dow: 6, start: '09:00', type: 'vin', name: 'Saturday Open Flow', teacher: 'marek', room: 0, level: 2, lang: 'en' },
    { dow: 6, start: '09:30', type: 'pil', name: 'Pilates Strong',     teacher: 'lucia', room: 1, level: 3, lang: 'sk' },
    { dow: 6, start: '10:30', type: 'vin', name: 'Slow Flow',          teacher: 'eva',   room: 0, level: 1, lang: 'cs' },
    { dow: 6, start: '11:00', type: 'pre', name: 'Prenatal yoga',      teacher: 'sara',  room: 1, level: 1, lang: 'cs' },
    { dow: 6, start: '17:00', type: 'yin', name: 'Saturday Yin',       teacher: 'eva',   room: 0, level: 1, lang: 'cs' },

    // Sunday
    { dow: 0, start: '09:00', type: 'vin', name: 'Sunday Slow',        teacher: 'eva',   room: 0, level: 1, lang: 'cs' },
    { dow: 0, start: '10:30', type: 'bre', name: 'Sunday Breath',      teacher: 'anna',  room: 1, level: 1, lang: 'cs' },
    { dow: 0, start: '17:00', type: 'yin', name: 'Sunday Yin',         teacher: 'sara',  room: 0, level: 1, lang: 'cs' },
    { dow: 0, start: '18:30', type: 'med', name: 'Reset Meditation',   teacher: 'anna',  room: 1, level: 1, lang: 'cs' }
  ];

  // ─────────────────── Helpers ───────────────────
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function startOfWeek(d) {
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dow = date.getDay();           // 0..6, Sunday=0
    var diff = (dow === 0 ? -6 : 1 - dow); // ISO Monday start
    date.setDate(date.getDate() + diff);
    return date;
  }

  function fmtDateKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseTime(t) {
    var p = t.split(':');
    return { h: +p[0], m: +p[1] };
  }

  function classDateTime(weekStart, dow, time) {
    var t = parseTime(time);
    var d = new Date(weekStart);
    var offset = dow === 0 ? 6 : dow - 1;     // Mon=0, Sun=6
    d.setDate(d.getDate() + offset);
    d.setHours(t.h, t.m, 0, 0);
    return d;
  }

  function hash32(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function writeJSON(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {}
  }

  // ─────────────────── Pub/Sub ───────────────────
  var listeners = [];
  function subscribe(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }
  function emit(ev) { listeners.forEach(function (f) { try { f(ev); } catch (e) {} }); }

  // ─────────────────── State ───────────────────
  function getBookings() { return readJSON(KEY_BOOKINGS, []); }
  function setBookings(b) { writeJSON(KEY_BOOKINGS, b); emit({ type: 'bookings' }); }

  function getPasses() {
    var p = readJSON(KEY_PASSES, null);
    if (p) return p;
    p = { credits: 0, items: [] };
    writeJSON(KEY_PASSES, p);
    return p;
  }
  function setPasses(p) { writeJSON(KEY_PASSES, p); emit({ type: 'passes' }); }

  function getUser() {
    var u = readJSON(KEY_USER, null);
    if (u) return u;
    u = { name: '', email: '', phone: '' };
    writeJSON(KEY_USER, u);
    return u;
  }
  function setUser(u) { writeJSON(KEY_USER, u); emit({ type: 'user' }); }

  // Drift map: classId -> small extra count added since last visit, persisted briefly
  function getDrift() {
    var d = readJSON(KEY_DRIFT, null);
    if (!d || (Date.now() - d.t) > 1000 * 60 * 60 * 4) {
      d = { t: Date.now(), m: {} };
      writeJSON(KEY_DRIFT, d);
    }
    return d;
  }
  function bumpDrift(classId) {
    var d = getDrift();
    d.m[classId] = (d.m[classId] || 0) + 1;
    d.t = Date.now();
    writeJSON(KEY_DRIFT, d);
  }

  // ─────────────────── Class instances ───────────────────
  // Build all classes between (today − 7 days) and (today + 28 days).
  function buildInstances() {
    var today = new Date();
    var monday = startOfWeek(today);
    var fromMonday = new Date(monday); fromMonday.setDate(fromMonday.getDate() - 7);
    var toMonday   = new Date(monday); toMonday.setDate(toMonday.getDate() + 28);

    var out = [];
    for (var w = new Date(fromMonday); w < toMonday; w.setDate(w.getDate() + 7)) {
      var weekStart = new Date(w);
      for (var i = 0; i < TEMPLATE.length; i++) {
        var t = TEMPLATE[i];
        var when = classDateTime(weekStart, t.dow, t.start);
        var ct = CFG.classTypes[t.type];
        var endHM = (function () {
          var st = parseTime(t.start);
          var total = st.h * 60 + st.m + ct.dur;
          return pad(Math.floor(total / 60) % 24) + ':' + pad(total % 60);
        })();
        var id = 'c-' + fmtDateKey(when) + '-' + t.start.replace(':', '') + '-' + t.type + '-' + t.teacher;
        out.push({
          id: id,
          start: when,
          startKey: fmtDateKey(when),
          startHM: t.start,
          endHM: endHM,
          dow: when.getDay(),
          type: ct.id,
          typeName: ct.name,
          name: t.name,
          teacherId: t.teacher,
          room: CFG.rooms[t.room],
          level: t.level,
          lang: t.lang,
          duration: ct.dur,
          capacity: ct.capacity
        });
      }
    }
    return out;
  }

  var INSTANCES = null;
  function instances() {
    if (!INSTANCES) INSTANCES = buildInstances();
    return INSTANCES;
  }

  function classById(id) {
    var all = instances();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function teacher(id) {
    for (var i = 0; i < CFG.teachers.length; i++) if (CFG.teachers[i].id === id) return CFG.teachers[i];
    return { id: id, name: id, bio: '' };
  }

  // ─────────────────── Capacity logic ───────────────────
  // We create a believable "occupancy curve":
  //   • Deterministic baseline per class id (hash-based seed)
  //   • Grows as the class approaches (more people book the day before)
  //   • Plus my own bookings + page-session drift
  function baselineFor(c) {
    var h = hash32(c.id);
    var base = (h % 70) / 100;          // 0..0.69
    // popularity weighting per type
    var pop = ({ pwr: 0.18, vin: 0.10, pil: 0.06, yin: 0.04, bre: 0.0, pre: -0.04, med: -0.05 })[c.type] || 0;
    // peak hours bias (07:00-09:00, 17:00-20:00)
    var hour = parseTime(c.startHM).h;
    var peak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20) ? 0.10 : 0;
    return Math.max(0.05, base + pop + peak);
  }

  function fillFor(c) {
    var msToStart = c.start.getTime() - Date.now();
    var hToStart  = msToStart / 36e5;
    var ratio = baselineFor(c);
    if (hToStart < -1)              ratio = Math.min(0.92, ratio + 0.20);  // past class — looks fuller
    else if (hToStart < 24)         ratio = Math.min(0.95, ratio + 0.20);  // within 24h
    else if (hToStart < 72)         ratio = Math.min(0.85, ratio + 0.10);  // within 3 days
    var taken = Math.round(ratio * c.capacity);
    var drift = getDrift().m[c.id] || 0;
    return Math.min(c.capacity + CFG.waitlistMax, taken + drift);
  }

  function status(c) {
    var taken = fillFor(c);
    var mine  = isBooked(c.id);
    var totalTaken = taken + (mine ? 1 : 0);
    var spotsLeft  = c.capacity - totalTaken;
    var state =
      spotsLeft > c.capacity * 0.5 ? 'open'    :
      spotsLeft > 2                ? 'filling' :
      spotsLeft > 0                ? 'almost'  :
      totalTaken < c.capacity + CFG.waitlistMax ? 'waitlist' : 'full';
    var msToStart = c.start.getTime() - Date.now();
    return {
      taken: totalTaken,
      capacity: c.capacity,
      spotsLeft: Math.max(0, spotsLeft),
      state: state,
      mine: mine,
      isPast: msToStart < 0,
      isStartingSoon: msToStart > 0 && msToStart < 60 * 60 * 1000,
      hoursToStart: msToStart / 36e5
    };
  }

  // ─────────────────── Booking actions ───────────────────
  function isBooked(classId) {
    return getBookings().some(function (b) { return b.classId === classId && b.state !== 'cancelled'; });
  }

  function canCancel(classId) {
    var c = classById(classId);
    if (!c) return false;
    var hToStart = (c.start.getTime() - Date.now()) / 36e5;
    return hToStart >= CFG.cancelWindowHours;
  }

  function totalCredits() {
    var p = getPasses();
    var now = Date.now();
    var sum = 0;
    p.items.forEach(function (it) {
      if (it.expires && it.expires < now) return;
      sum += it.creditsLeft;
    });
    return sum;
  }

  function spendCredit() {
    var p = getPasses();
    var now = Date.now();
    p.items.sort(function (a, b) { return (a.expires || Infinity) - (b.expires || Infinity); });
    for (var i = 0; i < p.items.length; i++) {
      var it = p.items[i];
      if (it.expires && it.expires < now) continue;
      if (it.creditsLeft > 0) { it.creditsLeft -= 1; setPasses(p); return true; }
    }
    return false;
  }

  function refundCredit() {
    var p = getPasses();
    var now = Date.now();
    for (var i = 0; i < p.items.length; i++) {
      var it = p.items[i];
      if (!it.expires || it.expires > now) { it.creditsLeft += 1; setPasses(p); return true; }
    }
    p.items.push({ id: 'refund-' + Date.now(), passId: 'drop', name: 'Refunded credit', creditsLeft: 1, expires: null, purchasedAt: Date.now() });
    setPasses(p);
    return true;
  }

  function book(classId, opts) {
    opts = opts || {};
    var c = classById(classId);
    if (!c) return { ok: false, error: 'not_found' };
    if (isBooked(classId)) return { ok: false, error: 'already' };
    if (c.start.getTime() < Date.now()) return { ok: false, error: 'past' };

    var st = status(c);
    var willWaitlist = st.spotsLeft <= 0;

    // payment / credit
    var paid = false;
    if (opts.useCredit) {
      if (totalCredits() <= 0) return { ok: false, error: 'no_credit' };
      if (!spendCredit()) return { ok: false, error: 'no_credit' };
      paid = 'credit';
    } else if (opts.payment) {
      paid = 'card';
    } else {
      return { ok: false, error: 'no_payment' };
    }

    var bookings = getBookings();
    bookings.push({
      id: 'b-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      classId: classId,
      bookedAt: Date.now(),
      state: willWaitlist ? 'waitlist' : 'confirmed',
      paid: paid
    });
    setBookings(bookings);
    bumpDrift(classId);
    return { ok: true, waitlist: willWaitlist };
  }

  function cancel(bookingId) {
    var bookings = getBookings();
    var b = bookings.filter(function (x) { return x.id === bookingId; })[0];
    if (!b) return { ok: false, error: 'not_found' };
    var c = classById(b.classId);
    if (!c) {
      b.state = 'cancelled'; setBookings(bookings); return { ok: true };
    }
    var hToStart = (c.start.getTime() - Date.now()) / 36e5;
    if (hToStart < CFG.cancelWindowHours) return { ok: false, error: 'too_late' };
    b.state = 'cancelled';
    b.cancelledAt = Date.now();
    setBookings(bookings);
    if (b.paid === 'credit') refundCredit();
    return { ok: true };
  }

  function purchase(passId, payment) {
    var pass = CFG.passes.filter(function (p) { return p.id === passId; })[0];
    if (!pass) return { ok: false, error: 'not_found' };
    if (!payment) return { ok: false, error: 'no_payment' };
    var p = getPasses();
    p.items.push({
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      passId: pass.id,
      name: pass.name,
      creditsLeft: pass.credits,
      expires: pass.validDays ? Date.now() + pass.validDays * 86400000 : null,
      purchasedAt: Date.now(),
      priceCzk: pass.priceCzk
    });
    setPasses(p);
    return { ok: true, pass: pass };
  }

  // ─────────────────── Public API ───────────────────
  global.AriaBooking = {
    config: CFG,
    teacher: teacher,
    instances: instances,
    classById: classById,
    status: status,
    isBooked: isBooked,
    canCancel: canCancel,
    book: book,
    cancel: cancel,
    purchase: purchase,
    bookings: getBookings,
    passes: getPasses,
    totalCredits: totalCredits,
    user: getUser,
    setUser: setUser,
    subscribe: subscribe,
    helpers: {
      startOfWeek: startOfWeek,
      fmtDateKey: fmtDateKey,
      parseTime: parseTime,
      pad: pad
    }
  };
})(window);
