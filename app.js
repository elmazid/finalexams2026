/* DAWAM · logika & tampilan. Tanpa framework, tanpa server; semua progres tersimpan di perangkat. */
(function () {
  'use strict';
  const D = window.DAWAM_DATA;
  const QD = window.DAWAM_QUOTES;
  const SUB = D.SUBJECTS;
  const KEY = 'dawam.v1';

  /* ================= util ================= */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); };
  const addDays = (k, n) => { const d = parse(k); d.setDate(d.getDate() + n); return ymd(d); };
  const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const hm = (m) => { m = Math.round(m); m = ((m % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
  const sum = (o) => Object.values(o || {}).reduce((a, b) => a + (b || 0), 0);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const DOW = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const DOW3 = ['Ahd', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const MON = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const longDate = (k) => { const d = parse(k); return `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`; };
  const shortDate = (k) => { const d = parse(k); return `${d.getDate()} ${MON3[d.getMonth()]}`; };
  const dur = (m) => { m = Math.max(0, Math.round(m)); const h = Math.floor(m / 60); return h ? `${h}j ${pad(m % 60)}m` : `${m}m`; };
  const ALL_DAYS = (() => { const a = []; for (let k = D.START; k <= D.END; k = addDays(k, 1)) a.push(k); return a; })();
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= ikon ================= */
  const IC = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    week: '<rect x="3.5" y="4.5" width="17" height="16" rx="3"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4M8 13.5h2M14 13.5h2M8 17h2"/>',
    route: '<circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="5.5" r="2"/><path d="M8 18.5h7.5a3.25 3.25 0 0 0 0-6.5h-7a3.25 3.25 0 0 1 0-6.5H16"/>',
    trophy: '<path d="M8 20.5h8M12 16.5v4M7 3.5h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v1.5a3.5 3.5 0 0 1-3.5 3.5M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    link: '<path d="M10 13.5a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10.5a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
    spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16.5v4M17 18.5h4"/>',
    moon: '<path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13"/>',
    cap: '<path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z"/><path d="M6.5 11v4.5c3 2 8 2 11 0V11M21.5 9v5"/>',
    dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    cup: '<path d="M4.5 9h12v4.5a4.5 4.5 0 0 1-4.5 4.5H9a4.5 4.5 0 0 1-4.5-4.5z"/><path d="M16.5 10h1.5a2.5 2.5 0 0 1 0 5h-1.5M8.5 3v3M12.5 3v3"/>',
    pen: '<path d="m4 20 4-1 11-11-3-3L5 16z"/><path d="m13.5 6.5 3 3"/>',
    bed: '<path d="M3 18.5V7M3 14h18v4.5M21 14v-1.5a3 3 0 0 0-3-3h-7V14"/><circle cx="7" cy="11" r="1.8"/>',
    flag: '<path d="M5 21V4M5 4.5h11.5L14.5 8.5l2 4H5"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
    shield: '<path d="M12 3 19.5 6v5.5c0 4.5-3.2 8.1-7.5 9.5-4.3-1.4-7.5-5-7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="12" rx="2"/><path d="M12 8.5v12M3.5 12.5h17M12 8.5C10.5 5 6.5 4.5 6.5 7c0 1.5 2 1.5 5.5 1.5 3.5 0 5.5 0 5.5-1.5 0-2.5-4-2-5.5 1.5z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    map: '<path d="m9 4.5 6 2 5.5-2v14l-5.5 2-6-2-5.5 2v-14z"/><path d="M9 4.5v14M15 6.5v14"/>',
    left: '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
    right: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
    down: '<path d="m6 9.5 6 6 6-6"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    sunrise: '<path d="M12 3v4M5.2 9.7l1.4 1.4M18.8 9.7l-1.4 1.4M2.5 17h19M7 17a5 5 0 0 1 10 0M8.5 20.5h7"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>',
    note: '<path d="M5.5 3.5h9l4 4v13h-13z"/><path d="M14 3.5v4.5h4.5M8.5 12.5h7M8.5 16h4.5"/>',
    quran: '<path d="M12 7c-2-1.6-5-2.1-8-1.6v12.8c3-.5 6 0 8 1.6 2-1.6 5-2.1 8-1.6V5.4c-3-.5-6 0-8 1.6zM12 7v12.8"/><path d="M7 10h2.5M14.5 10H17"/>',
    sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    share: '<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12v7.5h14V12"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    leaf: '<path d="M5 19c0-8 5-13.5 14.5-14.5C19 14 13.5 19 5 19z"/><path d="M5 19c3-4 6-6.5 9.5-8.5"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/>',
  };
  const icon = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;

  /* ================= waktu ================= */
  const qs = new URLSearchParams(location.search);
  const DEBUG_NOW = qs.get('now') ? new Date(qs.get('now')) : null;
  const BOOT = Date.now();
  const now = () => (DEBUG_NOW && !isNaN(DEBUG_NOW) ? new Date(DEBUG_NOW.getTime() + (Date.now() - BOOT)) : new Date());
  // "Hari aplikasi" berganti jam 03:00, supaya begadang sebentar tidak memotong hari.
  const appKey = (d) => { const x = new Date(d); if (x.getHours() < 3) x.setDate(x.getDate() - 1); return ymd(x); };
  const appMin = (d) => { const m = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; return d.getHours() < 3 ? m + 1440 : m; };

  /* ================= state ================= */
  const fresh = () => ({
    v: 1, days: {}, bonus: [], map: {}, evals: {}, badges: {}, lvl: 0, welcomed: false,
    bahts: { deadline: D.BAHTS_DEADLINE, items: [0, 1, 2].map((i) => ({ name: 'Bahts ' + (i + 1), st: [0, 0, 0, 0] })) },
    settings: { sound: false },
  });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* storage tidak tersedia */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* abaikan */ } };
  const EMPTY = Object.freeze({ s: {}, c: {}, ts: [] });
  const peek = (k) => S.days[k] || EMPTY;
  const dayW = (k) => S.days[k] || (S.days[k] = { s: {}, c: {}, ts: [] });
  const mapOf = (s) => { const m = S.map[s] || {}; return { total: m.total != null ? m.total : SUB[s].total, done: m.done || 0, unit: m.unit || SUB[s].unit, hist: m.hist || [] }; };

  /* ================= rencana harian ================= */
  const STUDY = { study: 1, morning: 1, reserve: 1 };
  const capOf = (min) => (min >= 25 ? 1 + Math.floor((min - 25) / 30) : 0);
  let _pc = {};
  function plan(k) {
    const ck = k + '|' + S.bahts.deadline;
    if (_pc[ck]) return _pc[ck];
    const ov = D.DAYS[k] || {};
    const dow = parse(k).getDay();
    const bl = (ov.blocks || D.WEEK[dow]).map((b) => Object.assign({}, b));
    bl.forEach((b) => {
      const c = ov.cv && ov.cv[hm(b.s)];
      if (c === 'study') Object.assign(b, { type: 'study', label: 'Belajar', cap: capOf(b.e - b.s), conv: 1 });
      else if (c === 'bahts') Object.assign(b, { type: 'bahts', label: 'Bahts', cap: 0, conv: 1 });
    });
    if (k > S.bahts.deadline) bl.forEach((b) => { if (b.type === 'bahts') Object.assign(b, { type: 'study', label: 'Belajar', cap: capOf(b.e - b.s), conv: 1 }); });
    bl.sort((a, b) => a.s - b.s);
    const full = [];
    let t = 300;
    bl.forEach((b) => { if (b.s > t) full.push({ s: t, e: b.s, type: 'gap', label: 'Jeda', cap: 0 }); full.push(b); t = Math.max(t, b.e); });
    if (t < 1350) full.push({ s: t, e: 1350, type: 'gap', label: 'Jeda', cap: 0 });
    full.push({ s: 1350, e: 1740, type: 'sleep', label: 'Tidur', cap: 0 });
    full.forEach((b, i) => { b.i = i; });
    const t0 = ov.t || {};
    const o = ov.o || Object.keys(t0);
    const p = {
      k, dow, blocks: full, t: t0, o, m: ov.m || 'rr', ev: ov.ev || [], tk: ov.tk || [], n: ov.n || '',
      ph: ov.ph != null ? ov.ph : (k < D.START ? 0 : 3), mn: ov.mn || o[0] || null, from: ov.from ? D.toMin(ov.from) : 0,
      light: !!ov.light, last: !!ov.last, exams: D.EXAMS.filter((e) => e.date === k), inRange: k >= D.START && k <= D.END,
      nd: ov.nd || [],
    };
    p.hasWorkout = full.some((b) => b.type === 'workout');
    p.bahtsBlocks = full.filter((b) => b.type === 'bahts');
    return (_pc[ck] = p);
  }

  function targets(p, dd) {
    if (dd.min && p.mn) return { [p.mn]: 2 };
    const t = Object.assign({}, p.t);
    p.ev.forEach((e) => { if (e.close && e.sub && dd.c['ev:' + e.id] && t[e.sub] != null) t[e.sub] = Math.min(t[e.sub], dd.s[e.sub] || 0); });
    if (p.exams.length) {
      // Begitu ujian dimulai, sisa sesi persiapan matkul itu tidak lagi relevan.
      const n = now(), tk = appKey(n), nm = appMin(n);
      p.exams.forEach((e) => {
        const started = p.k < tk || (p.k === tk && nm >= D.toMin(e.s)) || dd.c['ex:' + e.id];
        if (started && t[e.id] != null) t[e.id] = Math.min(t[e.id], dd.s[e.id] || 0);
      });
    }
    return t;
  }

  function buildQueue(R, order, mode) {
    const rem = Object.assign({}, R);
    const subs = order.filter((s) => rem[s] > 0).concat(Object.keys(rem).filter((s) => order.indexOf(s) < 0 && rem[s] > 0));
    const q = [];
    if (mode === 'seq') { subs.forEach((s) => { for (let i = 0; i < rem[s]; i++) q.push(s); }); return q; }
    let more = true;
    while (more) {
      more = false;
      subs.forEach((s) => { const n = Math.min(2, rem[s]); for (let i = 0; i < n; i++) q.push(s); rem[s] -= n; if (rem[s] > 0) more = true; });
    }
    return q;
  }

  function yTop(k) {
    const yk = addDays(k, -1);
    const y = peek(yk).s;
    let arr = Object.keys(y).filter((s) => y[s] > 0).sort((a, b) => y[b] - y[a]);
    if (!arr.length && D.DAYS[yk]) { const t = D.DAYS[yk].t || {}; arr = Object.keys(t).sort((a, b) => t[b] - t[a]); }
    return arr;
  }

  function assign(p, queue, from, yt) {
    const q = queue.slice();
    const out = [];
    p.blocks.forEach((b) => {
      if (!STUDY[b.type] || b.e <= from) return;
      const cap = b.s < from ? Math.min(b.cap, capOf(b.e - from)) : b.cap;
      if (cap <= 0) return;
      const take = [];
      if (b.pref) {
        b.pref.forEach((s) => { let i; while (take.length < cap && (i = q.indexOf(s)) >= 0) take.push(q.splice(i, 1)[0]); });
      } else if (b.type === 'morning') {
        for (const s of yt) { const i = q.lastIndexOf(s); if (i >= 0) { take.push(q.splice(i, 1)[0]); break; } }
      }
      while (take.length < cap && q.length) take.push(q.shift());
      out.push({ b, subs: take, cap });
    });
    return { out, left: q };
  }

  function recommend(p, dd, nm) {
    const T = targets(p, dd);
    const R = {};
    Object.keys(T).forEach((s) => { R[s] = Math.max(0, T[s] - (dd.s[s] || 0)); });
    const yt = yTop(p.k);
    const live = assign(p, buildQueue(R, p.o, p.m), Math.max(nm, p.from), yt);
    const ideal = assign(p, buildQueue(T, p.o, p.m), p.from, yt);
    const E = {};
    ideal.out.forEach((x) => { if (x.b.e <= nm) x.subs.forEach((s) => { E[s] = (E[s] || 0) + 1; }); });
    const over = {};
    Object.keys(E).forEach((s) => { const v = E[s] - (dd.s[s] || 0); if (v > 0) over[s] = v; });
    return { T, R, live, ideal, over };
  }

  function currentBlock(p, nm) {
    if (nm < 300) return { s: 180, e: 300, type: 'sleep', label: 'Tidur', i: -1, pre: true };
    return p.blocks.find((b) => nm >= b.s && nm < b.e) || p.blocks[p.blocks.length - 1];
  }

  function weekDebts(k) {
    const sun = addDays(k, -parse(k).getDay());
    const debts = {};
    for (let x = sun; x < k; x = addDays(x, 1)) {
      if (x < D.START) continue;
      const p = plan(x), dd = peek(x), T = targets(p, dd);
      Object.keys(T).forEach((s) => {
        if (p.nd.indexOf(s) >= 0) return;
        const r = T[s] - (dd.s[s] || 0);
        if (r > 0) debts[s] = (debts[s] || 0) + r;
      });
    }
    const tp = plan(k), td = peek(k), TT = targets(tp, td);
    Object.keys(td.s).forEach((s) => { const extra = (td.s[s] || 0) - (TT[s] || 0); if (extra > 0 && debts[s]) debts[s] = Math.max(0, debts[s] - extra); });
    Object.keys(debts).forEach((s) => { if (!debts[s]) delete debts[s]; });
    return debts;
  }

  const nextExam = (t) => D.EXAMS.find((e) => new Date(`${e.date}T${e.s}:00`) > t);
  const examStart = (e) => new Date(`${e.date}T${e.s}:00`);

  /* ================= statistik & hadiah ================= */
  const EV_XP = { uts: 30, sim: 40, deadline: 15 };
  function dayXP(k) {
    const dd = S.days[k];
    if (!dd) return 0;
    const p = plan(k), c = dd.c;
    let xp = sum(dd.s) * 10;
    if (c.quran) xp += 5;
    if (c.review) xp += 5;
    if (c.workout) xp += 5;
    if (c.bahts) xp += 10;
    if (dd.niat) xp += 3;
    if (dd.win) xp += 3;
    p.ev.forEach((e) => { if (c['ev:' + e.id]) xp += EV_XP[e.kind] || 10; });
    p.tk.forEach((t) => { if (c['tk:' + t[0]]) xp += 10; });
    p.exams.forEach((e) => { if (c['ex:' + e.id]) xp += 50; });
    const tt = sum(targets(p, dd));
    if (tt > 0 && sum(dd.s) >= tt) xp += 25;
    return xp;
  }
  function totalXP() {
    let xp = 0;
    Object.keys(S.days).forEach((k) => { xp += dayXP(k); });
    S.bonus.forEach((b) => { xp += b.xp; });
    S.bahts.items.forEach((it) => { xp += it.st.reduce((a, b) => a + b, 0) * 10; });
    return xp;
  }
  const levelOf = (xp) => { let i = 0; D.LEVELS.forEach((l, j) => { if (xp >= l.xp) i = j; }); return i; };

  const qualifies = (k) => { const dd = S.days[k]; return !!(dd && dd.c.quran && dd.c.review && sum(dd.s) >= 2); };
  function streak(todayK) {
    let cur = 0, best = 0, bangkit = false, brokeOrShield = false;
    const grace = {};
    for (const k of ALL_DAYS) {
      if (k > todayK) break;
      if (qualifies(k)) { cur++; if (brokeOrShield) bangkit = true; brokeOrShield = false; }
      else if (k !== todayK) {
        const wk = addDays(k, -parse(k).getDay());
        if (cur > 0) brokeOrShield = true;
        if (cur > 0 && !grace[wk]) grace[wk] = k; else cur = 0;
      }
      best = Math.max(best, cur);
    }
    const wkNow = addDays(todayK, -parse(todayK).getDay());
    return { cur, best, grace, graceLeft: !grace[wkNow], bangkit, todayDone: qualifies(todayK) };
  }

  const BADGES = [
    { id: 'bismillah', name: 'Bismillah', desc: 'Sesi pertama tercatat', icon: 'spark', test: (x) => x.sessions >= 1 },
    { id: 'ghadwah', name: 'Berkah Pagi', desc: '5 sesi sebelum jam 08:00', icon: 'sunrise', test: (x) => x.early >= 5 },
    { id: 'chain3', name: 'Rantai 3', desc: '3 hari beruntun memenuhi minimum', icon: 'link', test: (x) => x.st.best >= 3 },
    { id: 'chain7', name: 'Rantai 7', desc: 'Sepekan tanpa putus', icon: 'link', test: (x) => x.st.best >= 7 },
    { id: 'chain14', name: 'Rantai 14', desc: 'Dua pekan tanpa putus', icon: 'link', test: (x) => x.st.best >= 14 },
    { id: 'full1', name: 'Hari Penuh', desc: 'Target satu hari tuntas', icon: 'target', test: (x) => x.fullDays >= 1 },
    { id: 'full5', name: 'Lima Hari Penuh', desc: 'Lima hari dengan target tuntas', icon: 'target', test: (x) => x.fullDays >= 5 },
    { id: 'far25', name: 'Faraidh 25', desc: '25 sesi Faraidh', icon: 'bolt', test: (x) => (x.bySub.FAR || 0) >= 25 },
    { id: 'far50', name: 'Faraidh 50', desc: '50 sesi Faraidh', icon: 'bolt', test: (x) => (x.bySub.FAR || 0) >= 50 },
    { id: 'bid40', name: 'Bidayah 40', desc: '40 sesi Muamalat + Usroh', icon: 'book', test: (x) => (x.bySub.MUA || 0) + (x.bySub.USR || 0) >= 40 },
    { id: 'sim', name: 'Gladi Bersih', desc: 'Dua simulasi tuntas', icon: 'flag', test: (x) => x.sims >= 2 },
    { id: 'bahts', name: 'Bahts Tuntas', desc: 'Tiga bahts sampai tahap final', icon: 'pen', test: (x) => x.bahtsFinal >= 3 },
    { id: 'peta', name: 'Peta Lengkap', desc: 'Jumlah unit 7 matkul terisi', icon: 'map', test: (x) => x.mapped >= 7 },
    { id: 'jurnal7', name: 'Tujuh Kemenangan', desc: 'Tujuh kalimat kemenangan ditulis', icon: 'note', test: (x) => x.wins >= 7 },
    { id: 'bangkit', name: 'Bangkit', desc: 'Kembali memenuhi minimum setelah sehari bolong', icon: 'shield', test: (x) => x.st.bangkit },
    { id: 'pekan50', name: 'Pekan 50', desc: '50 sesi dalam satu pekan', icon: 'star', test: (x) => x.bestWeek >= 50 },
    { id: 'uts', name: 'UTS Terlampaui', desc: 'Ketiga UTS pekan ini dicentang', icon: 'check', test: (x) => x.uts >= 3 },
    { id: 'khatam', name: 'Khatam UAS', desc: 'Tujuh ujian selesai', icon: 'trophy', test: (x) => x.exams >= 7 },
  ];

  function stats(todayK) {
    const x = { sessions: 0, early: 0, fullDays: 0, bySub: {}, sims: 0, uts: 0, exams: 0, wins: 0, bestDay: 0, weeks: {} };
    Object.keys(S.days).forEach((k) => {
      const dd = S.days[k], n = sum(dd.s), p = plan(k);
      x.sessions += n;
      x.bestDay = Math.max(x.bestDay, n);
      Object.keys(dd.s).forEach((s) => { x.bySub[s] = (x.bySub[s] || 0) + dd.s[s]; });
      (dd.ts || []).forEach((t) => { const h = new Date(t[1]).getHours(); if (h >= 3 && h < 8) x.early++; });
      const tt = sum(targets(p, dd));
      if (tt > 0 && n >= tt) x.fullDays++;
      p.ev.forEach((e) => { if (dd.c['ev:' + e.id]) { if (e.kind === 'sim') x.sims++; if (e.kind === 'uts') x.uts++; } });
      p.exams.forEach((e) => { if (dd.c['ex:' + e.id]) x.exams++; });
      if (dd.win) x.wins++;
      const wk = addDays(k, -parse(k).getDay());
      x.weeks[wk] = (x.weeks[wk] || 0) + n;
    });
    x.bestWeek = Math.max(0, ...Object.values(x.weeks));
    x.bahtsFinal = S.bahts.items.filter((it) => it.st[3]).length;
    x.mapped = D.ORDER.filter((s) => mapOf(s).total > 0).length;
    x.st = streak(todayK);
    return x;
  }

  function checkBadges(x, silent) {
    const got = [];
    BADGES.forEach((b) => { if (!S.badges[b.id] && b.test(x)) { S.badges[b.id] = ymd(now()); got.push(b); } });
    if (got.length) {
      save();
      if (!silent) got.forEach((b, i) => setTimeout(() => toast(`${icon(b.icon)}<span>Lencana baru: <b>${esc(b.name)}</b></span>`, null, 3000), 700 + i * 1100));
    }
  }

  /* ================= langit & tema ================= */
  const SKY = [
    [0, '#06060d', '#0e0e1c'], [270, '#0b0a1a', '#17132b'], [300, '#2a2150', '#5a3e6d'],
    [345, '#e8a28e', '#f7d7bf'], [420, '#a6cff0', '#fcecd9'], [600, '#5badea', '#e2f1fc'],
    [725, '#f2cd78', '#fff3d8'], [870, '#efb259', '#ffe6bd'], [990, '#e7894b', '#f8cd9f'],
    [1055, '#76438d', '#de7e5e'], [1110, '#3b2b6d', '#693e71'], [1200, '#231e4a', '#372b5a'],
    [1320, '#15132a', '#221b38'], [1350, '#0a0a14', '#131226'], [1440, '#06060d', '#0e0e1c'],
  ];
  const lerpHex = (a, b, t) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = (sh) => Math.round(((pa >> sh) & 255) + (((pb >> sh) & 255) - ((pa >> sh) & 255)) * t);
    return '#' + [16, 8, 0].map((sh) => pad(ch(sh).toString(16))).join('');
  };
  function skyAt(m) {
    m = ((m % 1440) + 1440) % 1440;
    for (let i = 0; i < SKY.length - 1; i++) {
      const [a, ta, ba] = SKY[i], [b, tb, bb] = SKY[i + 1];
      if (m >= a && m <= b) { const t = (m - a) / (b - a || 1); return [lerpHex(ta, tb, t), lerpHex(ba, bb, t)]; }
    }
    return [SKY[0][1], SKY[0][2]];
  }
  const lum = (hex) => {
    const v = parseInt(hex.slice(1), 16);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(v >> 16) + 0.7152 * f((v >> 8) & 255) + 0.0722 * f(v & 255);
  };
  function phaseOf(nm) {
    const m = nm % 1440;
    if (nm >= 1350 || nm < 180) return { id: 'nawm', ar: 'النَّوم', name: 'Waktu tidur', hint: 'istirahatkan otak' };
    if (m < 300) return { id: 'sahar', ar: 'السَّحَر', name: 'Sahar', hint: 'menjelang Subuh' };
    if (m < 725) return { id: 'ghadwah', ar: 'الغَدْوة', name: 'Ghadwah', hint: 'pagi' };
    if (m < 1055) return { id: 'rauhah', ar: 'الرَّوْحة', name: 'Rauhah', hint: 'siang–sore' };
    return { id: 'duljah', ar: 'الدُّلْجة', name: 'Duljah', hint: 'malam' };
  }
  const hijri = (k) => D.HIJRI[k] || '';
  const hijriDay = (k) => parseInt(hijri(k), 10) || 15;
  function moonSVG(p) {
    const r = 20, kk = Math.cos(2 * Math.PI * p), rx = Math.abs(kk) * r, wax = p < 0.5;
    const so = wax ? 1 : 0, si = wax ? (kk > 0 ? 0 : 1) : (kk < 0 ? 0 : 1);
    const d = `M0 ${-r}A${r} ${r} 0 0 ${so} 0 ${r}A${rx.toFixed(2)} ${r} 0 0 ${si} 0 ${-r}Z`;
    return `<svg viewBox="-26 -26 52 52" width="64" height="64" aria-hidden="true"><circle r="${r}" fill="rgba(255,255,255,.07)"/><path d="${d}" fill="#FFF4D6"/></svg>`;
  }
  function applyTheme(n, mode) {
    const nm = appMin(n), m = nm % 1440, k = appKey(n);
    const [top, bot] = skyAt(m);
    const root = document.documentElement;
    root.style.setProperty('--sky-top', top);
    root.style.setProperty('--sky-bot', bot);
    const dark = (lum(top) + lum(bot)) / 2 < 0.3;
    root.dataset.ink = dark ? 'light' : 'dark';
    root.dataset.mode = mode || '';
    const night = clamp(1 - ((lum(top) + lum(bot)) / 2) / 0.12, 0, 1);
    root.style.setProperty('--night', night.toFixed(2));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', top);
    const orb = $('#orb');
    if (!orb) return;
    const RISE = 390, SET = 1055;
    if (m >= RISE - 25 && m <= SET + 8) {
      const t = clamp((m - RISE) / (SET - RISE), 0, 1);
      orb.className = 'orb sun';
      orb.style.left = (10 + t * 80).toFixed(1) + '%';
      orb.style.top = (150 - Math.sin(Math.PI * t) * 110).toFixed(0) + 'px';
      orb.innerHTML = '';
    } else {
      const span = 1440 - SET + RISE;
      const t = clamp((m >= SET ? m - SET : m + 1440 - SET) / span, 0, 1);
      orb.className = 'orb moon';
      orb.style.left = (86 - t * 72).toFixed(1) + '%';
      orb.style.top = (120 - Math.sin(Math.PI * t) * 70).toFixed(0) + 'px';
      orb.innerHTML = moonSVG(((hijriDay(k) - 1) + 0.5) / 29.53);
    }
  }

  /* ================= suara & perayaan ================= */
  let actx = null;
  function chime(kind) {
    if (!S.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime + 0.01;
      const notes = kind === 'big' ? [523.25, 659.25, 783.99, 1046.5] : [783.99, 1174.66];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain(), at = t0 + i * 0.09;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.07, at + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
        o.connect(g); g.connect(actx.destination); o.start(at); o.stop(at + 0.6);
      });
    } catch (e) { /* audio tidak tersedia */ }
  }
  function confetti(n) {
    if (reduced()) return;
    const cv = $('#confetti');
    if (!cv || !cv.getContext) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = (cv.width = innerWidth * dpr), H = (cv.height = innerHeight * dpr);
    const ctx = cv.getContext('2d');
    cv.hidden = false;
    const cols = ['#8B5CF6', '#06B6D4', '#EC4899', '#3B82F6', '#EAB308', '#F97316', '#22C55E', '#F5B300'];
    const ps = Array.from({ length: n || 90 }, () => ({ x: W / 2 + (Math.random() - 0.5) * W * 0.4, y: H * 0.32, vx: (Math.random() - 0.5) * 15 * dpr, vy: (-Math.random() * 15 - 5) * dpr, r: (3 + Math.random() * 4) * dpr, c: cols[(Math.random() * cols.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3 }));
    let f = 0;
    (function step() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((q) => { q.vy += 0.45 * dpr; q.x += q.vx; q.y += q.vy; q.vx *= 0.99; q.a += q.va; ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.a); ctx.fillStyle = q.c; ctx.fillRect(-q.r, -q.r / 2, q.r * 2, q.r); ctx.restore(); });
      if (++f < 130) requestAnimationFrame(step); else { ctx.clearRect(0, 0, W, H); cv.hidden = true; }
    })();
  }
  let toastTimer = null, lastUndo = null, popId = null;
  function toast(html, undo, ms) {
    const el = $('#toast');
    if (!el) return;
    lastUndo = undo || null;
    el.innerHTML = `<div class="toast-in">${html}${undo ? '<button class="toast-undo" data-act="undo">Batalkan</button>' : ''}</div>`;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.classList.remove('show'); lastUndo = null; }, ms || 2600);
  }
  function floatXP(el, txt) {
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'floatxp';
    f.textContent = txt;
    f.style.left = r.left + r.width / 2 + 'px';
    f.style.top = r.top - 6 + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1000);
  }
  const mq = [];
  function modal(html) {
    const m = $('#modal');
    if (!m.hidden) { mq.push(html); return; }
    m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
    const b = m.querySelector('[data-act="modal-close"]');
    if (b) setTimeout(() => b.focus(), 50);
  }
  function closeModal() {
    const m = $('#modal');
    m.hidden = true;
    m.innerHTML = '';
    if (mq.length) setTimeout(() => modal(mq.shift()), 180);
    render();
  }

  /* ================= potongan tampilan ================= */
  const subDot = (s) => `<i class="sd" style="--c:${SUB[s].color}"></i>`;
  const ring = (pct, size, stroke, label) => {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" class="ring-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - clamp(pct, 0, 1))).toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>${label ? `<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" class="ring-t">${label}</text>` : ''}</svg>`;
  };
  function agg(subs) {
    const a = [];
    subs.forEach((s) => { const x = a.find((y) => y.s === s); if (x) x.n++; else a.push({ s, n: 1 }); });
    return a;
  }
  function chipsHTML(subs, over, k, mode) {
    const ov = Object.assign({}, over || {});
    return agg(subs).map(({ s, n }) => {
      const late = Math.min(n, ov[s] || 0);
      if (late) ov[s] -= late;
      if (mode === 'mini') return `<span class="mchip" style="--c:${SUB[s].color}"><i></i>${esc(SUB[s].name)}${n > 1 ? ` ×${n}` : ''}</span>`;
      return `<button class="chip" style="--c:${SUB[s].color}" data-act="log" data-s="${s}" data-k="${k}" aria-label="Catat satu sesi ${esc(SUB[s].name)}">
        <span class="chip-dot"></span><span class="chip-name">${esc(SUB[s].name)}</span><span class="chip-n">×${n}</span>${late ? `<span class="chip-late">${late} tertunda</span>` : ''}<span class="chip-plus">${icon('plus')}</span></button>`;
    }).join('');
  }
  const TYPE_ICON = { study: 'book', morning: 'quran', reserve: 'shield', class: 'cap', workout: 'dumbbell', rest: 'cup', gap: 'cup', bahts: 'pen', sleep: 'bed', winddown: 'moon', review: 'note', rutin: 'sunrise', quran: 'quran', free: 'leaf', exam: 'flag', sim: 'flag' };

  /* ================= tab Hari Ini ================= */
  function heroHTML(n, k, nm) {
    const ph = phaseOf(nm);
    const st = streak(k);
    const xp = totalXP(), lv = levelOf(xp), L = D.LEVELS[lv];
    const ne = nextExam(n);
    let count = '';
    if (ne) {
      const ms = examStart(ne) - n, dd = Math.floor(ms / 864e5), hh = Math.floor((ms % 864e5) / 36e5), mi = Math.floor((ms % 36e5) / 6e4);
      const same = D.EXAMS.filter((e) => e.date === ne.date);
      const names = same.map((e) => SUB[e.id].name).join(' & ');
      const doneN = D.EXAMS.filter((e) => examStart(e) <= n).length;
      const left = sessionsUntil(k, ne.date);
      count = `
      <div class="count" aria-label="Hitung mundur ujian">
        <div class="eyebrow">${doneN ? `Ujian berikutnya · ${doneN}/7 terlewati` : 'Menuju ujian pertama'}</div>
        <div class="count-num"><b>${dd}</b><span>hari</span><b>${hh}</b><span>jam</span><b>${pad(mi)}</b><span>mnt</span></div>
        <div class="count-sub">${esc(names)} · ${esc(longDate(ne.date))} · ${ne.s} · R. ${esc(ne.room.replace(' Syariah', ''))}</div>
        <div class="track">${D.EXAMS.map((e) => {
          const past = examStart(e) <= n, nxt = e === ne || (e.date === ne.date && !past);
          return `<div class="tk ${past ? 'done' : ''} ${nxt ? 'next' : ''}" style="--c:${SUB[e.id].color}"><i></i><span>${parse(e.date).getDate()} · ${esc(SUB[e.id].name.slice(0, 3))}</span></div>`;
        }).join('')}</div>
        ${left > 0 ? `<div class="count-foot">± ${left} sesi terencana sampai hari itu. Satu per satu.</div>` : ''}
      </div>`;
    }
    return `
    <header class="hero">
      <div class="hero-top">
        <div class="phase">
          <div class="phase-ar" lang="ar" dir="rtl">${ph.ar}</div>
          <div class="phase-id">${esc(ph.name)} · ${esc(longDate(k))}</div>
          <div class="phase-hj" lang="ar" dir="rtl">${esc(hijri(k))} هـ</div>
        </div>
        <div class="pills">
          <button class="pill" data-act="tab" data-tab="capaian" aria-label="Rantai hari beruntun">${icon('link')}<b>${st.cur}</b><span>hari</span></button>
          <button class="pill gold" data-act="tab" data-tab="capaian" aria-label="Level">${icon('star')}<b>${esc(L.name)}</b></button>
        </div>
      </div>
      ${count}
    </header>`;
  }

  function sessionsUntil(fromK, toK) {
    let n = 0;
    for (let k = fromK; k < toK; k = addDays(k, 1)) {
      const p = plan(k), dd = peek(k), T = targets(p, dd);
      n += k === fromK ? Object.keys(T).reduce((a, s) => a + Math.max(0, T[s] - (dd.s[s] || 0)), 0) : sum(T);
    }
    return n;
  }

  function welcomeHTML() {
    if (S.welcomed) return '';
    return `<section class="card welcome">
      <div class="eyebrow">Cara pakai</div>
      <ol>
        <li>Selesai satu pomodoro, ketuk chip matkul di kartu <b>Sekarang</b>.</li>
        <li>Sesi yang terlewat otomatis pindah ke blok kosong berikutnya, ditandai <i>tertunda</i>.</li>
        <li>Isi jumlah unit tiap matkul di <b>Timeline → Peta Materi</b>.</li>
        <li>Rantai hari bertahan selama minimum terpenuhi: Qur'an, 2 sesi, review.</li>
      </ol>
      <button class="btn" data-act="welcome-ok">Mengerti, bismillah</button>
    </section>`;
  }

  function examTodayHTML(p, dd, n) {
    if (!p.exams.length) return '';
    const nm = appMin(n);
    const focus = p.exams.find((e) => nm < D.toMin(e.e) && !dd.c['ex:' + e.id]);
    return p.exams.map((e) => {
      const s = D.toMin(e.s), en = D.toMin(e.e), done = dd.c['ex:' + e.id];
      const state = nm < s ? 'before' : nm < en ? 'during' : 'after';
      const full = e === focus;
      const kit = ['Pulpen 2 + pensil', 'Kartu mahasiswa', 'Air minum', 'Jam tangan', 'Datang 15 menit lebih awal'];
      return `<section class="card exam ${state} ${full ? '' : 'compact'}" style="--c:${SUB[e.id].color}">
        <div class="exam-top"><span class="badge-ev">${state === 'after' || done ? 'Ujian selesai' : full ? 'Hari ujian' : 'Ujian berikutnya hari ini'}</span><span class="exam-code" lang="ar" dir="rtl">${esc(e.code)}</span></div>
        <div class="exam-name"><span lang="ar" dir="rtl" class="exam-ar">${esc(SUB[e.id].ar)}</span><b>${esc(SUB[e.id].full)}</b></div>
        <div class="exam-meta">${e.s}–${e.e} · Ruang ${esc(e.room)}${state === 'before' ? ` · mulai ${dur(s - nm)} lagi` : state === 'during' ? ' · sedang berlangsung' : ''}</div>
        ${full && state === 'before' ? `<ul class="kit">${kit.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
          <p class="exam-note">Jangan buka materi baru. Cukup kartu ✗, makan secukupnya, napas pelan.</p>` : ''}
        ${full ? `<div class="dua"><p lang="ar" dir="rtl">﴿${esc(QD.EXAM_DUA.ar)}﴾</p><span>${esc(QD.EXAM_DUA.src)}</span></div>` : ''}
        ${state === 'after' || done ? `<button class="btn ${done ? 'ghost' : ''}" data-act="toggle" data-id="ex:${e.id}" data-k="${p.k}">${done ? `${icon('check')} Ujian ${esc(SUB[e.id].name)} selesai` : `Tandai ujian ${esc(SUB[e.id].name)} selesai`}</button>` : ''}
      </section>`;
    }).join('');
  }

  function nextBlockAfter(p, cb) {
    const i = p.blocks.indexOf(cb);
    for (let j = i + 1; j < p.blocks.length; j++) { const b = p.blocks[j]; if (b.type !== 'gap') return b; }
    return null;
  }

  function nowCardHTML(p, dd, rec, cb, nm, n) {
    const k = p.k;
    const prog = cb.e > cb.s ? clamp((nm - cb.s) / (cb.e - cb.s), 0, 1) : 0;
    const left = cb.e - nm;
    const live = rec.live.out.find((x) => x.b === cb);
    const remain = sum(rec.R);
    const head = (title, sub) => `
      <div class="now-head"><div class="eyebrow">Sekarang · ${hm(cb.s)}–${hm(cb.e)}</div><div class="now-left">${left > 0 ? `sisa ${dur(left)}` : ''}</div></div>
      <div class="now-title">${icon(TYPE_ICON[cb.type] || 'clock')}<span>${esc(title)}</span></div>
      ${sub ? `<p class="now-sub">${sub}</p>` : ''}
      <div class="bar" aria-hidden="true"><i style="--p:${(prog * 100).toFixed(1)}%"></i></div>`;
    const nb = nextBlockAfter(p, cb);
    const nextLine = () => {
      const nx = rec.live.out.find((x) => x.b.s >= cb.e && x.subs.length);
      let s = '';
      if (nb) s += `<div class="next"><span class="eyebrow">Berikutnya</span><span>${hm(nb.s)} · ${esc(nb.label)}</span></div>`;
      if (nx && nx.b !== nb) s += `<div class="next"><span class="eyebrow">Blok belajar</span><span>${hm(nx.b.s)} · </span><span class="mini">${chipsHTML(nx.subs, null, k, 'mini')}</span></div>`;
      else if (nx) s += `<div class="next"><span class="mini">${chipsHTML(nx.subs, null, k, 'mini')}</span></div>`;
      return s;
    };
    const toggleBtn = (id, label, on) => `<button class="btn ${on ? 'ghost' : ''}" data-act="toggle" data-id="${id}" data-k="${k}">${on ? icon('check') : ''}${esc(label)}</button>`;
    let inner = '';
    const t = cb.type;

    if (!p.inRange && k > D.END) return '';
    if (STUDY[t]) {
      const subs = live ? live.subs : [];
      let title = t === 'morning' ? 'Uji ingatan kemarin' : t === 'reserve' ? 'Cadangan + evaluasi pekan' : cb.label === 'Belajar' ? `Belajar · ${live ? live.cap : cb.cap} sesi` : cb.label;
      let sub = t === 'morning' ? "Qur'an dulu, lalu satu sesi menguji materi kemarin tanpa buka buku." : '';
      if (p.light && t !== 'morning') sub = 'Hari ringan: hanya kartu ✗ dan ~, tanpa materi baru.';
      let chips = '';
      const capNow = cb.s < nm ? capOf(cb.e - nm) : cb.cap;
      if (subs.length) chips = `<div class="chips">${chipsHTML(subs, rec.over, k)}</div><p class="hint">Selesai satu pomodoro? Ketuk chip-nya.</p>`;
      else if (capNow === 0 && remain > 0) chips = `<p class="hint">Kurang dari 25 menit tersisa di blok ini. Pakai untuk jeda singkat atau siapkan blok berikutnya.</p>`;
      else if (remain === 0 && sum(rec.T) > 0) {
        const bonus = (nextExam(n) || {}).id || p.o[0];
        chips = `<div class="done-msg">${icon('check')} Target hari ini tuntas. Sisa blok ini bebas, atau tambah sesi opsional:</div>${bonus ? `<div class="chips">${chipsHTML([bonus], null, k)}</div>` : ''}`;
      } else if (!sum(rec.T)) chips = `<p class="hint">Tidak ada target di hari ini.</p>`;
      else chips = `<p class="hint">Blok ini kosong di rencana. Sisa target ada di blok berikutnya.</p>`;
      if (t === 'reserve') {
        const debts = weekDebts(k);
        const examIdx = (s) => { const i = D.EXAMS.findIndex((e) => e.id === s); return i < 0 ? 99 : i; };
        const ds = Object.keys(debts).sort((a, b) => examIdx(a) - examIdx(b));
        const totalDebt = sum(debts);
        chips += ds.length
          ? `<div class="sublabel">Tertunda pekan ini · ${totalDebt} sesi</div><div class="chips">${chipsHTML([].concat(...ds.slice(0, 3).map((s) => Array(Math.min(2, debts[s])).fill(s))), null, k)}</div><p class="hint">Tidak harus lunas semua. Ambil dari matkul yang ujiannya paling dekat.</p>`
          : `<p class="hint">${icon('check')} Tidak ada sesi tertunda pekan ini.</p>`;
      }
      if (t === 'morning') chips = `<div class="row-btns">${toggleBtn('quran', "Qur'an selesai", dd.c.quran)}</div>` + chips;
      inner = head(title, sub) + chips + nextLine();
    } else if (t === 'class') {
      inner = head('Kuliah', `Fokus di kelas. Catat poin yang ditekankan dosen, itu bahan prioritas.`) + nextLine();
    } else if (t === 'workout') {
      inner = head(cb.label, 'Gerak dulu. Aliran darah ke otak naik, fokus sesudahnya biasanya lebih tajam.') + `<div class="row-btns">${toggleBtn('workout', 'Workout selesai', dd.c.workout)}</div>` + nextLine();
    } else if (t === 'bahts') {
      const it = S.bahts.items.find((x) => !x.st[3]);
      const stg = ['Kerangka', 'Referensi', 'Draf', 'Final'];
      const cur = it ? `${esc(it.name)} · tahap ${esc(stg[it.st.findIndex((v) => !v)] || 'Final')}` : 'Semua bahts sudah final';
      inner = head('Bahts', `${cur}. Batas: ${esc(longDate(S.bahts.deadline))}.`) + `<div class="row-btns">${toggleBtn('bahts', 'Blok bahts selesai', dd.c.bahts)}<button class="btn ghost" data-act="tl-view" data-v="bahts">${icon('pen')}Progres bahts</button></div>` + nextLine();
    } else if (t === 'quran') {
      inner = head("Qur'an", p.k <= '2026-11-25' ? 'Hafalan baru, lalu murajaah.' : 'Murajaah.') + `<div class="row-btns">${toggleBtn('quran', "Qur'an selesai", dd.c.quran)}</div>` + nextLine();
    } else if (t === 'review') {
      const tk = addDays(k, 1), tp = plan(tk);
      const tT = Object.keys(tp.t);
      inner = head(cb.label, 'Ulang singkat yang dipelajari hari ini, lalu lihat rencana besok.') +
        `<div class="row-btns">${toggleBtn('review', 'Review selesai', dd.c.review)}</div>` +
        (tp.inRange ? `<div class="tomorrow"><div class="eyebrow">Besok · ${esc(longDate(tk))}</div><div class="mini">${tT.map((s) => `<span class="mchip" style="--c:${SUB[s].color}"><i></i>${esc(SUB[s].name)} ×${tp.t[s]}</span>`).join('')}${tp.exams.map((e) => `<span class="badge-ev">Ujian ${esc(SUB[e.id].name)}</span>`).join('')}${tp.ev.map((e) => `<span class="badge-ev">${esc(e.label)}</span>`).join('')}</div>${firstStudy(tp) ? `<p class="hint">Blok belajar pertama: ${hm(firstStudy(tp).s)}</p>` : ''}</div>` : '');
    } else if (t === 'winddown' || t === 'sleep') {
      const tk = cb.pre ? k : addDays(k, 1), tp = plan(tk), fs = firstStudy(tp);
      inner = head(t === 'sleep' ? 'Waktunya tidur' : 'Mode redup', t === 'sleep' ? 'Tidur adalah tahap akhir belajar: materi hari ini dikonsolidasikan malam ini.' : 'Taruh HP jauh dari kasur. Besok bangun 05:00.') +
        (tp.inRange && fs ? `<div class="tomorrow"><div class="eyebrow">${cb.pre ? 'Hari ini' : 'Besok'} · ${esc(longDate(tk))}</div><p class="hint">Bangun 05:00 · blok belajar pertama ${hm(fs.s)}</p></div>` : '');
    } else if (t === 'free') {
      inner = head(cb.label, p.last ? 'Tujuh ujian selesai. Syukuri, istirahat, kabari keluarga.' : 'Tidak ada target di blok ini. Istirahat juga bagian dari rencana.') + nextLine();
    } else if (t === 'exam' || t === 'sim') {
      inner = head(cb.label, t === 'sim' ? 'Tutup buku, ikuti waktu persis seperti hari H.' : 'Semoga Allah mudahkan. Kerjakan yang paling yakin dulu.') + (t === 'sim' ? '' : '') + nextLine();
    } else if (t === 'rutin') {
      inner = head(cb.label, 'Subuh, dzikir pagi, lalu masuk blok pertama.') + nextLine();
    } else {
      const f = QD.FAIDAH[(diffDays(D.START, k) * 3 + cb.i) % QD.FAIDAH.length];
      inner = head(cb.label === 'Jeda' ? 'Jeda' : cb.label, esc(f)) + nextLine();
    }
    const dim = t === 'class' || t === 'sleep' || t === 'winddown';
    return `<section class="card now ${dim ? 'is-dim' : ''} now-${t}" aria-live="polite">${inner}</section>`;
  }
  const firstStudy = (p) => p.blocks.find((b) => STUDY[b.type] && b.cap > 0);

  function journalHTML(p, dd, nm) {
    const out = [];
    const m = nm % 1440;
    if (nm < 1440 && m < 725 && !dd.niat && p.inRange) {
      out.push(`<section class="card journal"><label class="eyebrow" for="niat-in">Kartu niat · pagi</label>
        <p class="hint">Satu kalimat: untuk apa kamu belajar hari ini?</p>
        <div class="inline"><input id="niat-in" class="field" maxlength="140" placeholder="Hari ini aku belajar supaya…" autocomplete="off"><button class="btn" data-act="save-niat">Simpan</button></div></section>`);
    } else if (dd.niat) {
      out.push(`<div class="niat-line">${icon('target')}<span><b>Niat:</b> ${esc(dd.niat)}</span></div>`);
    }
    if ((nm >= 1200 || nm >= 1440) && !dd.win && p.inRange) {
      out.push(`<section class="card journal"><label class="eyebrow" for="win-in">Kalimat kemenangan · malam</label>
        <p class="hint">Satu hal yang berhasil hari ini, sekecil apa pun.</p>
        <div class="inline"><input id="win-in" class="field" maxlength="160" placeholder="Hari ini aku berhasil…" autocomplete="off"><button class="btn" data-act="save-win">Simpan</button></div></section>`);
    }
    return out.join('');
  }

  function evalHTML(p, nm, cb) {
    if (p.dow !== 6 || !p.inRange || nm < 1200 || nm >= 1350) return '';
    const sun = addDays(p.k, -6);
    let done = 0, tgt = 0;
    const bySub = {};
    for (let k = sun; k <= p.k; k = addDays(k, 1)) {
      if (k < D.START) continue;
      const pp = plan(k), dd = peek(k), T = targets(pp, dd);
      done += sum(dd.s); tgt += sum(T);
      Object.keys(T).forEach((s) => { bySub[s] = bySub[s] || [0, 0]; bySub[s][1] += T[s]; });
      Object.keys(dd.s).forEach((s) => { bySub[s] = bySub[s] || [0, 0]; bySub[s][0] += dd.s[s]; });
    }
    const ev = S.evals[p.k] || {};
    return `<section class="card evalc"><div class="eyebrow">Evaluasi pekan · ${esc(shortDate(sun < D.START ? D.START : sun))}–${esc(shortDate(p.k))}</div>
      <div class="eval-top">${ring(tgt ? done / tgt : 0, 64, 7, `${tgt ? Math.round((done / tgt) * 100) : 0}%`)}<div><b>${done}</b> dari ${tgt} sesi terencana<br><span class="hint">${Object.keys(bySub).map((s) => `${SUB[s].name} ${bySub[s][0]}/${bySub[s][1]}`).join(' · ')}</span></div></div>
      <label class="sublabel" for="ev-a">Apa yang paling menghambat pekan ini?</label><textarea id="ev-a" class="field" rows="2">${esc(ev.a || '')}</textarea>
      <label class="sublabel" for="ev-b">Satu penyesuaian untuk pekan depan</label><textarea id="ev-b" class="field" rows="2">${esc(ev.b || '')}</textarea>
      <button class="btn" data-act="save-eval" data-k="${p.k}">Simpan evaluasi</button></section>`;
  }

  function quoteFor(k, nm) {
    const i = Math.max(0, diffDays(D.START, k)) % 32;
    const half = nm >= 1440 || nm % 1440 >= 725 ? 1 : 0;
    return { q: QD.QUOTES[(i * 2 + half) % QD.QUOTES.length], half };
  }
  function quoteHTML(k, nm) {
    const { q, half } = quoteFor(k, nm);
    const lab = half ? 'Bekal siang–malam' : 'Bekal pagi–siang';
    if (q.k === 'umum') {
      return `<section class="card quote umum"><div class="eyebrow">${lab}</div><p class="q-big">${esc(q.id)}</p>${q.orig ? `<p class="q-orig">“${esc(q.orig)}”</p>` : ''}<div class="q-src">${esc(q.src)}</div></section>`;
    }
    return `<section class="card quote ${q.k}"><div class="eyebrow">${lab}</div><p class="q-ar" lang="ar" dir="rtl">${q.k === 'quran' ? '﴿' + esc(q.ar) + '﴾' : '«' + esc(q.ar) + '»'}</p><p class="q-id">${esc(q.id)}</p><div class="q-src">${esc(q.src)}</div></section>`;
  }

  function checklistHTML(p, dd, rec) {
    const k = p.k;
    const T = rec.T, tt = sum(T), done = sum(dd.s);
    const order = p.o.concat(Object.keys(T).filter((s) => p.o.indexOf(s) < 0)).concat(D.ORDER.filter((s) => T[s] == null && dd.s[s] > 0));
    const seen = {};
    const subs = order.filter((s) => { if (seen[s]) return false; seen[s] = 1; return T[s] != null || dd.s[s] > 0; });
    const rows = subs.map((s) => {
      const t = T[s] || 0, d = dd.s[s] || 0, n = Math.max(t, d);
      let dots = '';
      for (let i = 0; i < n; i++) dots += `<button class="d ${i < d ? 'on' : ''} ${i >= t ? 'extra' : ''} ${popId === 'd:' + s + ':' + i ? 'pop' : ''}" data-act="${i < d ? 'unlog' : 'log'}" data-s="${s}" data-k="${k}" aria-label="${i < d ? 'Batalkan satu sesi' : 'Catat satu sesi'} ${esc(SUB[s].name)}"></button>`;
      dots += `<button class="d add" data-act="log" data-s="${s}" data-k="${k}" aria-label="Tambah sesi ${esc(SUB[s].name)}">${icon('plus')}</button>`;
      return `<div class="srow" style="--c:${SUB[s].color}"><div class="sname">${subDot(s)}<span>${esc(SUB[s].name)}</span><small>${d}/${t}</small></div><div class="dots">${dots}</div></div>`;
    }).join('');
    const items = [];
    const qLabel = k <= '2026-11-25' ? "Qur'an · hafalan baru + murajaah" : "Qur'an · murajaah";
    items.push({ id: 'quran', label: qLabel, ic: 'quran', min: 1 });
    if (p.hasWorkout && !dd.min) items.push({ id: 'workout', label: 'Workout', ic: 'dumbbell' });
    if (p.bahtsBlocks.length && !dd.min) items.push({ id: 'bahts', label: 'Bahts · ' + p.bahtsBlocks.map((b) => `${hm(b.s)}–${hm(b.e)}`).join(', '), ic: 'pen' });
    if (!dd.min) {
      p.ev.forEach((e) => items.push({ id: 'ev:' + e.id, label: e.label, ic: 'flag', strong: 1 }));
      p.exams.forEach((e) => items.push({ id: 'ex:' + e.id, label: `Ujian ${SUB[e.id].name} selesai`, ic: 'flag', strong: 1 }));
      p.tk.forEach((t) => items.push({ id: 'tk:' + t[0], label: t[1], ic: 'note' }));
    }
    items.push({ id: 'review', label: 'Review & rencana besok', ic: 'note', min: 1 });
    const list = items.map((it) => {
      const on = !!dd.c[it.id];
      return `<button class="citem ${on ? 'on' : ''} ${it.strong ? 'strong' : ''} ${popId === 'c:' + it.id ? 'pop' : ''}" data-act="toggle" data-id="${it.id}" data-k="${k}" aria-pressed="${on}"><span class="box">${on ? icon('check') : ''}</span><span class="clabel">${esc(it.label)}</span>${icon(it.ic, 'muted')}</button>`;
    }).join('');
    const pct = tt ? done / tt : 0;
    const q = qualifies(k);
    return `<section class="card checklist">
      <div class="cl-head">${ring(pct, 58, 6, `${Math.min(done, 99)}/${tt}`)}<div class="cl-title"><div class="eyebrow">${dd.min ? 'Mode hari minimum' : 'Daftar hari ini'}</div><b>${tt ? (done >= tt ? 'Target tuntas' : `${tt - Math.min(done, tt)} sesi lagi`) : 'Tanpa target sesi'}</b><span class="hint">${q ? `${icon('link')} Minimum terpenuhi, rantai aman` : "Minimum rantai: Qur'an, 2 sesi, review"}</span></div></div>
      ${rows ? `<div class="srows">${rows}</div>` : ''}
      <div class="citems">${list}</div>
      ${p.n && !dd.min ? `<p class="day-note">${icon('note')}<span>${esc(p.n)}</span></p>` : ''}
      ${p.inRange && p.mn ? `<button class="minbtn ${dd.min ? 'on' : ''}" data-act="min" data-k="${k}" aria-pressed="${!!dd.min}"><span class="sw"><i></i></span><span><b>Mode hari minimum</b><small>${dd.min ? 'Aktif: target penuh disembunyikan hari ini.' : `Hari berat? Cukup Qur'an, 2 sesi ${esc(SUB[p.mn].name)}, review.`}</small></span></button>` : ''}
    </section>`;
  }

  function restOfDayHTML(p, rec, cb) {
    const idx = p.blocks.indexOf(cb);
    const ups = p.blocks.slice(idx + 1).filter((b) => b.type !== 'gap' && b.type !== 'sleep').slice(0, 7);
    if (!ups.length) return '';
    return `<section class="card upcoming"><div class="eyebrow">Sisa hari ini</div><ol class="ulist">${ups.map((b) => {
      const x = rec.live.out.find((y) => y.b === b);
      const dim = b.type === 'class' || b.type === 'winddown';
      const extra = x && x.subs.length ? `<span class="mini">${chipsHTML(x.subs, null, p.k, 'mini')}</span>` : STUDY[b.type] ? '<span class="cap">opsional · target sudah terbagi</span>' : '';
      return `<li class="${dim ? 'dim' : ''} t-${b.type}"><span class="ut">${hm(b.s)}</span><span class="ul">${icon(TYPE_ICON[b.type] || 'clock')}<span>${esc(b.label)}</span></span>${extra}</li>`;
    }).join('')}</ol></section>`;
  }

  function khatamHTML() {
    const x = stats(appKey(now()));
    return `<section class="card khatam"><div class="phase-ar" lang="ar" dir="rtl">الحمد لله</div><h2>Khatam UAS</h2><p>${x.sessions} sesi · ±${Math.round((x.sessions * 25) / 60)} jam fokus · rantai terbaik ${x.st.best} hari.</p><p class="hint">Semoga Allah menerima dan memberi hasil terbaik.</p><button class="btn" data-act="tab" data-tab="capaian">Lihat capaian</button></section>`;
  }

  function viewToday() {
    const n = now(), k = appKey(n), nm = appMin(n);
    const p = plan(k), dd = peek(k);
    const cb = currentBlock(p, nm);
    applyTheme(n, cb.type === 'class' ? 'class' : cb.type === 'sleep' ? 'sleep' : cb.type === 'exam' ? 'exam' : '');
    if (k > D.END) return heroHTML(n, k, nm) + khatamHTML() + quoteHTML(k, nm);
    const rec = recommend(p, dd, nm);
    return [
      heroHTML(n, k, nm),
      welcomeHTML(),
      examTodayHTML(p, dd, n),
      nowCardHTML(p, dd, rec, cb, nm, n),
      journalHTML(p, dd, nm),
      evalHTML(p, nm, cb),
      quoteHTML(k, nm),
      checklistHTML(p, dd, rec),
      restOfDayHTML(p, rec, cb),
    ].join('');
  }

  /* ================= tab Pekan ================= */
  let weekSel = null;
  const WK_MIN = '2026-11-08', WK_MAX = '2026-12-06';
  function viewWeek() {
    const n = now(), today = appKey(n), nm = appMin(n);
    applyTheme(n, '');
    let sel = weekSel || (today < D.START ? D.START : today > D.END ? D.END : today);
    const sun = addDays(sel, -parse(sel).getDay());
    const days = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(sun, i));
    const wkNo = Math.floor(diffDays(WK_MIN, sun) / 7) + 1;
    const span = 1050, H = 132;
    const strip = days.map((k) => {
      const p = plan(k), inR = p.inRange;
      const segs = p.blocks.filter((b) => b.type !== 'gap' && b.type !== 'sleep' && b.type !== 'rest').map((b) => `<i class="ws t-${b.type}" style="top:${(((b.s - 300) / span) * H).toFixed(1)}px;height:${Math.max(2, ((b.e - b.s) / span) * H).toFixed(1)}px"></i>`).join('');
      const nowLine = k === today && nm >= 300 && nm < 1350 ? `<i class="wnow" style="top:${(((nm - 300) / span) * H).toFixed(1)}px"></i>` : '';
      const evs = p.exams.length ? 'exam' : p.ev.some((e) => e.kind === 'sim' || e.kind === 'uts') ? 'ev' : '';
      const dd = peek(k), T = sum(targets(p, dd)), dn = sum(dd.s);
      return `<button class="wcol ${k === today ? 'today' : ''} ${!inR ? 'out' : ''}" data-act="wk-day" data-k="${k}" aria-pressed="${k === sel}" aria-label="${esc(longDate(k))}">
        <span class="wd">${DOW3[parse(k).getDay()]}</span><span class="wn">${parse(k).getDate()}</span>
        <span class="wbar">${segs}${nowLine}</span>
        <span class="wdot ${evs}"></span><span class="wsum">${inR && T ? `${dn}/${T}` : '·'}</span></button>`;
    }).join('');
    return `
    <header class="phead"><div><div class="eyebrow">Pekan ${wkNo} · ${esc(shortDate(sun))}–${esc(shortDate(addDays(sun, 6)))}</div><h1>Jam kosong & rencana</h1></div>
      <div class="pnav"><button class="iconbtn" data-act="wk-prev" ${sun <= WK_MIN ? 'disabled' : ''} aria-label="Pekan sebelumnya">${icon('left')}</button><button class="iconbtn" data-act="wk-next" ${sun >= WK_MAX ? 'disabled' : ''} aria-label="Pekan berikutnya">${icon('right')}</button></div></header>
    <div class="wstrip">${strip}</div>
    <div class="legend">${[['study', 'Belajar'], ['class', 'Kuliah'], ['workout', 'Workout'], ['bahts', 'Bahts'], ['exam', 'Ujian/simulasi'], ['free', 'Bebas']].map(([t, l]) => `<span><i class="lg t-${t}"></i>${l}</span>`).join('')}</div>
    ${agendaHTML(sel, today, nm)}`;
  }

  function agendaHTML(k, today, nm) {
    const p = plan(k), dd = peek(k);
    const rec = recommend(p, dd, k === today ? nm : k < today ? 9999 : 0);
    const T = rec.T;
    const blocks = p.blocks.filter((b) => b.type !== 'gap');
    const rows = blocks.map((b) => {
      const x = (k === today ? rec.live : rec.ideal).out.find((y) => y.b === b);
      const isNow = k === today && nm >= b.s && nm < b.e;
      const past = k < today || (k === today && b.e <= nm);
      const dim = b.type === 'class' || b.type === 'sleep' || b.type === 'winddown';
      const prog = isNow ? clamp((nm - b.s) / (b.e - b.s), 0, 1) : 0;
      let right = '';
      if (STUDY[b.type]) right = x && x.subs.length ? `<span class="mini">${chipsHTML(x.subs, null, k, 'mini')}</span>` : `<span class="cap">${b.cap} sesi${k === today && past ? '' : ' · bebas'}</span>`;
      if (b.type === 'exam') right = `<span class="badge-ev">${esc((D.EXAMS.find((e) => e.date === k && e.id === b.sub) || {}).room || '')}</span>`;
      return `<li class="arow t-${b.type} ${dim ? 'dim' : ''} ${isNow ? 'now' : ''} ${past ? 'past' : ''}" ${isNow ? `style="--p:${(prog * 100).toFixed(1)}%"` : ''}>
        <span class="atime">${hm(b.s)}<small>${hm(b.e)}</small></span>
        <span class="abody"><span class="alabel"><i class="amark t-${b.type}"></i>${esc(b.label)}${b.cap && STUDY[b.type] && !(x && x.subs.length) ? '' : ''}</span>${right}</span></li>`;
    }).join('');
    const tChips = Object.keys(T).map((s) => `<span class="mchip" style="--c:${SUB[s].color}"><i></i>${esc(SUB[s].name)} ${dd.s[s] || 0}/${T[s]}</span>`).join('');
    return `<section class="card agenda">
      <div class="ag-head"><div><div class="eyebrow">${k === today ? 'Hari ini' : k < today ? 'Sudah lewat' : 'Rencana'}</div><h2>${esc(longDate(k))}</h2><div class="phase-hj small" lang="ar" dir="rtl">${esc(hijri(k))} هـ</div></div>
      ${p.inRange ? `<span class="badge-ph">${esc(D.PHASES[p.ph].name)}</span>` : ''}</div>
      ${p.exams.length || p.ev.length ? `<div class="mini">${p.exams.map((e) => `<span class="badge-ev">Ujian ${esc(SUB[e.id].name)} ${e.s}</span>`).join('')}${p.ev.map((e) => `<span class="badge-ev">${esc(e.label)}</span>`).join('')}</div>` : ''}
      ${tChips ? `<div class="mini">${tChips}</div>` : ''}
      ${p.n ? `<p class="day-note">${icon('note')}<span>${esc(p.n)}</span></p>` : ''}
      <ol class="alist">${rows}</ol></section>`;
  }

  /* ================= tab Timeline ================= */
  let tlOpen = null, mapEdit = null, tlView = 'tanggal', scrollToday = false;
  function viewTimeline() {
    const n = now(), today = appKey(n);
    applyTheme(n, '');
    if (tlOpen === null) tlOpen = today;
    const seg = `<div class="seg" role="tablist" aria-label="Bagian timeline">${[['tanggal', 'Tanggal'], ['peta', 'Peta materi'], ['bahts', 'Bahts']].map(([v, l]) => `<button role="tab" class="${tlView === v ? 'on' : ''}" aria-selected="${tlView === v}" data-act="tl-view" data-v="${v}">${l}</button>`).join('')}</div>`;
    const header = `<header class="phead"><div><div class="eyebrow">9 November – 10 Desember</div><h1>Timeline</h1></div></header>${seg}`;
    if (tlView === 'peta') return header + mapHTML(today);
    if (tlView === 'bahts') return header + bahtsHTML(today);
    const groups = D.PHASES.map((ph) => {
      const ks = ALL_DAYS.filter((k) => plan(k).ph === ph.id);
      const done = ks.reduce((a, k) => a + sum(peek(k).s), 0), tgt = ks.reduce((a, k) => a + sum(targets(plan(k), peek(k))), 0);
      return `<section class="tl-phase"><div class="tl-head"><div><div class="eyebrow">Fase ${ph.id + 1} · ${esc(ph.range)}</div><h3>${esc(ph.name)}</h3></div><span class="tl-sum">${done}/${tgt}</span></div><p class="hint">${esc(ph.desc)}</p>
        <ol class="tl-list">${ks.map((k) => tlRow(k, today)).join('')}</ol></section>`;
    }).join('');
    return header + groups;
  }
  function tlRow(k, today) {
    const p = plan(k), dd = peek(k), T = targets(p, dd), tt = sum(T), dn = sum(dd.s), d = parse(k);
    const open = tlOpen === k;
    const state = k < today ? 'past' : k === today ? 'today' : 'future';
    const badges = p.exams.map((e) => `<span class="badge-ev">Ujian ${esc(SUB[e.id].name)}</span>`).join('') + p.ev.map((e) => `<span class="badge-ev soft">${esc(e.label)}</span>`).join('') + (p.bahtsBlocks.length ? '<span class="badge-ev soft">Bahts</span>' : '') + (p.light ? '<span class="badge-ev soft">Hari ringan</span>' : '');
    const chips = Object.keys(T).map((s) => `<span class="mchip" style="--c:${SUB[s].color}"><i></i>${esc(SUB[s].name)} ${state === 'future' ? T[s] : `${dd.s[s] || 0}/${T[s]}`}</span>`).join('');
    const pct = tt ? clamp(dn / tt, 0, 1) : 0;
    return `<li class="tl-row ${state} ${open ? 'open' : ''}">
      <button class="tl-main" data-act="tl-open" data-k="${k}" aria-expanded="${open}">
        <span class="tl-date"><small>${DOW3[d.getDay()]}</small><b>${d.getDate()}</b><small>${MON3[d.getMonth()]}</small></span>
        <span class="tl-body">${badges ? `<span class="mini">${badges}</span>` : ''}<span class="mini">${chips || '<span class="hint">Tanpa target sesi</span>'}</span>
        ${state !== 'future' && tt ? `<span class="bar thin"><i style="--p:${(pct * 100).toFixed(0)}%"></i></span>` : ''}
        ${dd.note && !open ? `<span class="tl-note">${esc(dd.note)}</span>` : ''}</span>
        ${icon('down', 'chev')}</button>
      ${open ? `<div class="tl-more">
        <div class="phase-hj small" lang="ar" dir="rtl">${esc(hijri(k))} هـ</div>
        ${p.n ? `<p class="day-note">${icon('note')}<span>${esc(p.n)}</span></p>` : ''}
        ${state !== 'future' ? `<p class="hint">${dn} sesi tercatat${qualifies(k) ? ' · minimum terpenuhi' : ''}${dd.win ? ` · kemenangan: “${esc(dd.win)}”` : ''}</p>` : ''}
        <label class="sublabel" for="note-${k}">Catatan progres</label>
        <textarea id="note-${k}" class="field" rows="2" placeholder="Misal: Faraidh video 12–15, Muamalat bab salam">${esc(dd.note || '')}</textarea>
        <div class="row-btns"><button class="btn sm" data-act="save-note" data-k="${k}">Simpan catatan</button><button class="btn sm ghost" data-act="go-week" data-k="${k}">${icon('week')}Lihat jam</button></div>
      </div>` : ''}
    </li>`;
  }

  function mapHTML(today) {
    const rows = D.ORDER.map((s) => {
      const m = mapOf(s), due = SUB[s].due;
      const daysLeft = Math.max(1, diffDays(today, due) + 1);
      const remain = Math.max(0, m.total - m.done);
      let status = '';
      if (!m.total) status = `<span class="hint">Isi jumlah unit untuk melihat laju.</span>`;
      else if (remain === 0) status = `<span class="ok">${icon('check')} Putaran pertama tuntas</span>`;
      else {
        const need = remain / daysLeft;
        const h = m.hist.filter((x) => x[0] < today);
        let pace = null;
        if (m.hist.length) { const first = m.hist[0]; const days = Math.max(1, diffDays(first[0], today) + 1); pace = (m.done - (first[2] || 0)) / days; }
        const late = diffDays(today, due) < 0;
        status = late ? `<span class="warn">Lewat target ${esc(shortDate(due))}; sisa ${remain} ${esc(m.unit)}</span>` :
          `<span class="${pace !== null && pace + 1e-9 < need ? 'warn' : 'hint'}">Perlu ±${need < 1 ? need.toFixed(1) : Math.ceil(need)} ${esc(m.unit)}/hari sampai ${esc(shortDate(due))}${pace !== null ? ` · lajumu ${pace.toFixed(1)}/hari` : ''}</span>`;
        void h;
      }
      const pct = m.total ? clamp(m.done / m.total, 0, 1) : 0;
      const editing = mapEdit === s;
      return `<li class="mrow" style="--c:${SUB[s].color}">
        <div class="mname">${subDot(s)}<b>${esc(SUB[s].name)}</b><small>${m.total ? `${m.done}/${m.total} ${esc(m.unit)}` : 'belum diisi'}</small></div>
        <div class="mstep"><button class="iconbtn sm" data-act="map-dec" data-s="${s}" aria-label="Kurangi satu unit ${esc(SUB[s].name)}" ${m.done ? '' : 'disabled'}>${icon('minus')}</button><button class="iconbtn sm accent" data-act="map-inc" data-s="${s}" aria-label="Tambah satu unit ${esc(SUB[s].name)}" ${m.total && m.done < m.total ? '' : 'disabled'}>${icon('plus')}</button><button class="iconbtn sm" data-act="map-edit" data-s="${s}" aria-label="Atur unit ${esc(SUB[s].name)}">${icon('pen')}</button></div>
        <div class="bar thin" style="--accent:${SUB[s].color}"><i style="--p:${(pct * 100).toFixed(1)}%"></i></div>
        <div class="mmeta">${status}</div>
        ${editing ? `<div class="medit"><label class="sublabel" for="mt-${s}">Jumlah unit</label><input id="mt-${s}" class="field" type="number" inputmode="numeric" min="0" max="999" value="${m.total || ''}"><label class="sublabel" for="mu-${s}">Satuan</label><input id="mu-${s}" class="field" maxlength="16" value="${esc(m.unit)}"><div class="row-btns"><button class="btn sm" data-act="map-save" data-s="${s}">Simpan</button><button class="btn sm ghost" data-act="map-cancel">Batal</button></div></div>` : ''}
      </li>`;
    }).join('');
    return `<section class="card mapc"><div class="cardhead"><div><div class="eyebrow">Peta materi</div><h2>Putaran pertama</h2></div>${icon('map')}</div>
      <p class="hint">Isi jumlah unit tiap matkul (masalah, bab, halaman). Aplikasi menghitung laju yang dibutuhkan sampai target putaran pertama.</p><ol class="mlist">${rows}</ol></section>`;
  }

  function bahtsHTML(today) {
    const dl = S.bahts.deadline, left = diffDays(today, dl);
    const stg = ['Kerangka', 'Referensi', 'Draf', 'Final'];
    return `<section class="card bahtsc"><div class="cardhead"><div><div class="eyebrow">Sprint bahts</div><h2>${left > 0 ? `${left} hari lagi` : left === 0 ? 'Batas hari ini' : 'Sudah lewat batas'}</h2></div>${icon('pen')}</div>
      <div class="inline"><label class="sublabel" for="bahts-dl">Batas (asumsi, bisa diubah)</label><input id="bahts-dl" class="field" type="date" value="${dl}" min="2026-11-09" max="2026-12-10" data-change="bahts-dl"></div>
      <ol class="blist">${S.bahts.items.map((it, i) => `<li><input id="bn-${i}" class="field bname" maxlength="40" value="${esc(it.name)}" data-change="bahts-name" data-i="${i}" aria-label="Nama bahts ${i + 1}">
        <div class="stages">${stg.map((sname, j) => `<button class="stage ${it.st[j] ? 'on' : ''} ${popId === 'st:' + i + ':' + j ? 'pop' : ''}" data-act="bahts-st" data-i="${i}" data-j="${j}" aria-pressed="${!!it.st[j]}">${it.st[j] ? icon('check') : ''}${sname}</button>`).join('')}</div></li>`).join('')}</ol>
      <p class="hint">Setelah batas lewat, slot bahts otomatis berubah jadi blok belajar.</p></section>`;
  }

  /* ================= tab Capaian ================= */
  let resetAsk = false, ioOpen = false;
  function viewAch() {
    const n = now(), today = appKey(n);
    applyTheme(n, '');
    const x = stats(today);
    const xp = totalXP(), lv = levelOf(xp), L = D.LEVELS[lv], NL = D.LEVELS[lv + 1];
    const lvPct = NL ? (xp - L.xp) / (NL.xp - L.xp) : 1;
    const heat = (() => {
      const first = addDays(D.START, -parse(D.START).getDay());
      const cells = [];
      for (let k = first; k <= addDays(D.END, 6 - parse(D.END).getDay()); k = addDays(k, 1)) {
        if (k < D.START || k > D.END) { cells.push('<i class="hc out"></i>'); continue; }
        const p = plan(k), dd = peek(k), tt = sum(targets(p, dd)), dn = sum(dd.s);
        const r = tt ? dn / tt : dn ? 1 : 0;
        const l = dn === 0 ? 0 : r < 0.34 ? 1 : r < 0.67 ? 2 : r < 1 ? 3 : 4;
        const ex = p.exams.length ? ' ex' : '';
        cells.push(`<i class="hc${ex} ${k === today ? 'today' : ''} ${k > today ? 'fut' : ''}" data-l="${l}" title="${esc(shortDate(k))}: ${dn}/${tt}">${parse(k).getDate()}</i>`);
      }
      return cells.join('');
    })();
    const subRows = D.ORDER.map((s) => {
      let plannedTotal = 0, plannedToDate = 0;
      ALL_DAYS.forEach((k) => { const t = (D.DAYS[k] && D.DAYS[k].t && D.DAYS[k].t[s]) || 0; plannedTotal += t; if (k <= today) plannedToDate += t; });
      const d = x.bySub[s] || 0;
      return `<li style="--c:${SUB[s].color}">${ring(plannedTotal ? d / plannedTotal : 0, 46, 5, '')}<div><b>${esc(SUB[s].name)}</b><span class="hint">${d} dari ${plannedTotal} sesi · rencana s.d. hari ini ${plannedToDate}</span></div></li>`;
    }).join('');
    const wins = Object.keys(S.days).filter((k) => S.days[k].win).sort().reverse().slice(0, 12);
    const evals = Object.keys(S.evals).sort().reverse();
    const standalone = window.navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    const isPWA = !!document.querySelector('link[rel="manifest"]');
    return `<header class="phead"><div><div class="eyebrow">Capaian</div><h1>Jejak dawam</h1></div></header>
      <section class="card level"><div class="lv-top"><div><div class="eyebrow">Level ${lv + 1} dari 6</div><div class="lv-ar" lang="ar" dir="rtl">${L.ar}</div><b>${esc(L.name)}</b><span class="hint">${esc(L.desc)}</span></div><div class="lv-xp"><b>${xp}</b><span>XP</span></div></div>
        <div class="bar gold"><i style="--p:${(lvPct * 100).toFixed(1)}%"></i></div><p class="hint">${NL ? `${NL.xp - xp} XP lagi menuju ${esc(NL.name)} (${NL.ar})` : 'Level tertinggi tercapai.'}</p>
        <ol class="lv-steps">${D.LEVELS.map((l, i) => `<li class="${i <= lv ? 'on' : ''}"><span lang="ar" dir="rtl">${l.ar}</span></li>`).join('')}</ol></section>
      <div class="grid2">
        <section class="card stat"><div class="eyebrow">Rantai dawam</div><div class="big">${icon('link')}<b>${x.st.cur}</b><span>hari</span></div><p class="hint">Terbaik ${x.st.best} hari · jatah ampunan pekan ini ${x.st.graceLeft ? 'masih ada' : 'terpakai'}</p></section>
        <section class="card stat"><div class="eyebrow">Fokus total</div><div class="big">${icon('clock')}<b>${Math.round((x.sessions * 25) / 6) / 10}</b><span>jam</span></div><p class="hint">${x.sessions} sesi · rekor ${x.bestDay}/hari · ${x.fullDays} hari penuh</p></section>
      </div>
      <section class="card heatc"><div class="eyebrow">Peta 32 hari</div><div class="hrow">${DOW3.map((d) => `<span>${d}</span>`).join('')}</div><div class="heat">${heat}</div>
        <div class="hlegend"><span>sedikit</span><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i><span>target tuntas</span></div></section>
      <section class="card subc"><div class="eyebrow">Per matkul</div><ol class="slist">${subRows}</ol></section>
      <section class="card badgec"><div class="eyebrow">Lencana · ${Object.keys(S.badges).length}/${BADGES.length}</div><ol class="badges">${BADGES.map((b) => {
        const on = !!S.badges[b.id];
        return `<li class="bdg ${on ? 'on' : 'locked'}"><span class="bic">${icon(b.icon)}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></li>`;
      }).join('')}</ol></section>
      <section class="card winc"><div class="eyebrow">Jurnal kemenangan</div>${wins.length ? `<ol class="wins">${wins.map((k) => `<li><span>${esc(shortDate(k))}</span><p>${esc(S.days[k].win)}</p></li>`).join('')}</ol>` : '<p class="hint">Mulai malam ini: satu kalimat tentang hal yang berhasil. Lama-lama ini jadi bukti bahwa kamu mampu.</p>'}
        ${evals.length ? `<div class="sublabel">Evaluasi pekanan</div><ol class="wins">${evals.map((k) => `<li><span>${esc(shortDate(k))}</span><p><b>Hambatan:</b> ${esc(S.evals[k].a || '-')}<br><b>Penyesuaian:</b> ${esc(S.evals[k].b || '-')}</p></li>`).join('')}</ol>` : ''}</section>
      <section class="card setc"><div class="eyebrow">Pengaturan & data</div>
        <button class="minbtn ${S.settings.sound ? 'on' : ''}" data-act="sound" aria-pressed="${!!S.settings.sound}"><span class="sw"><i></i></span><span><b>Bunyi saat sesi tercatat</b><small>Denting pelan. Mati secara bawaan.</small></span></button>
        <div class="row-btns"><button class="btn sm ghost" data-act="io">${icon('copy')}Cadangkan / pulihkan</button>${resetAsk ? '<button class="btn sm danger" data-act="reset-yes">Ya, hapus semua progres</button><button class="btn sm ghost" data-act="reset-no">Batal</button>' : '<button class="btn sm ghost" data-act="reset">Hapus progres</button>'}</div>
        ${ioOpen ? `<label class="sublabel" for="io-text">Data cadangan (JSON)</label><textarea id="io-text" class="field mono" rows="5" spellcheck="false">${esc(JSON.stringify(S))}</textarea>
          <div class="row-btns"><button class="btn sm" data-act="copy">${icon('copy')}Salin</button>${isPWA && navigator.canShare ? `<button class="btn sm ghost" data-act="share">${icon('share')}Bagikan file</button>` : ''}<button class="btn sm ghost" data-act="import">Pulihkan dari teks di atas</button></div>
          <p class="hint">Simpan teks ini di Notes atau kirim ke dirimu sendiri. Untuk memulihkan, tempel lalu ketuk Pulihkan.</p>` : ''}
        ${isPWA && !standalone && /iphone|ipad|ipod/i.test(navigator.userAgent) ? `<p class="tip">${icon('share')}Pasang: buka di Safari → Share → <b>Add to Home Screen</b>, lalu selalu buka dari ikonnya.</p>` : ''}
      </section>`;
  }

  /* ================= router & render ================= */
  const TABS = [['hari-ini', 'Hari Ini', 'today'], ['pekan', 'Pekan', 'week'], ['timeline', 'Timeline', 'route'], ['capaian', 'Capaian', 'trophy']];
  let tab = 'hari-ini';
  function readHash() { const h = (location.hash || '').replace('#', ''); tab = TABS.some((t) => t[0] === h) ? h : 'hari-ini'; }
  function go(t) {
    if (t === tab) { window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); return; }
    tab = t;
    try { history.replaceState(null, '', '#' + t); } catch (e) { location.hash = t; }
    render(true);
    window.scrollTo(0, 0);
    if (t === 'timeline' && tlView === 'tanggal') {
      const row = $('.tl-row.today');
      if (row) setTimeout(() => row.scrollIntoView({ block: 'center', behavior: 'auto' }), 30);
    }
  }
  function renderTabs() {
    const el = $('#tabbar');
    el.innerHTML = `<div class="tabbar-in">${TABS.map(([id, label, ic]) => `<button class="tab" data-act="tab" data-tab="${id}" ${tab === id ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></button>`).join('')}</div>`;
  }
  function render(force) {
    const v = $('#view');
    if (!v) return;
    const ae = document.activeElement;
    if (!force && ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && v.contains(ae)) return;
    const html = tab === 'pekan' ? viewWeek() : tab === 'timeline' ? viewTimeline() : tab === 'capaian' ? viewAch() : viewToday();
    v.innerHTML = html;
    popId = null;
    renderTabs();
  }

  /* ================= aksi ================= */
  function fullNow(k) { const p = plan(k), dd = peek(k), tt = sum(targets(p, dd)); return tt > 0 && sum(dd.s) >= tt; }
  function afterChange(k, wasFull, bonus) {
    const xp = totalXP(), lv = levelOf(xp);
    if (bonus) modal(`<div class="sheet-ic gold">${icon('gift')}</div><div class="eyebrow">Kejutan</div><h2>+${bonus.xp} XP</h2><p>${esc(QD.FAIDAH[bonus.f])}</p><button class="btn" data-act="modal-close">Lanjut</button>`);
    if (lv > S.lvl) {
      const L = D.LEVELS[lv];
      S.lvl = lv; save();
      modal(`<div class="lv-ar big" lang="ar" dir="rtl">${L.ar}</div><div class="eyebrow">Naik level</div><h2>${esc(L.name)}</h2><p>${esc(L.desc)}. ${xp} XP terkumpul.</p><button class="btn" data-act="modal-close">Alhamdulillah</button>`);
      confetti(150); chime('big');
    } else if (lv < S.lvl) { S.lvl = lv; save(); }
    if (!wasFull && fullNow(k)) { confetti(100); chime('big'); setTimeout(() => toast(`${icon('target')}<span>Target hari ini tuntas. Alhamdulillah.</span>`, null, 3200), 900); }
    checkBadges(stats(appKey(now())));
    render(true);
  }
  function logSession(k, s, el) {
    const was = fullNow(k);
    const dd = dayW(k);
    dd.s[s] = (dd.s[s] || 0) + 1;
    const t = now().getTime();
    dd.ts.push([s, t]);
    popId = 'd:' + s + ':' + (dd.s[s] - 1);
    let bonus = null;
    if (Math.random() < 0.15) { bonus = { k, t, xp: [5, 10, 15, 20, 25][(Math.random() * 5) | 0], f: (Math.random() * QD.FAIDAH.length) | 0 }; S.bonus.push(bonus); }
    save();
    floatXP(el, '+10 XP');
    chime('small');
    toast(`<i class="tdot" style="--c:${SUB[s].color}"></i><span>${esc(SUB[s].name)} +1 sesi</span>`, () => { unlogSession(k, s, t); toast('Sesi dibatalkan'); });
    afterChange(k, was, bonus);
  }
  function unlogSession(k, s, t) {
    const dd = S.days[k];
    if (!dd || !dd.s[s]) return;
    dd.s[s]--;
    if (!dd.s[s]) delete dd.s[s];
    let idx = -1;
    if (t != null) idx = dd.ts.findIndex((x) => x[0] === s && x[1] === t);
    if (idx < 0) for (let i = dd.ts.length - 1; i >= 0; i--) if (dd.ts[i][0] === s) { idx = i; break; }
    if (idx >= 0) { const tt = dd.ts.splice(idx, 1)[0][1]; S.bonus = S.bonus.filter((b) => !(b.k === k && b.t === tt)); }
    save();
    afterChange(k, true, null);
  }
  function toggleCheck(k, id, el) {
    const was = fullNow(k);
    const dd = dayW(k);
    dd.c[id] = !dd.c[id];
    if (!dd.c[id]) delete dd.c[id];
    popId = dd.c[id] ? 'c:' + id : null;
    save();
    if (dd.c[id]) {
      floatXP(el, '+XP');
      chime('small');
      if (id.indexOf('ex:') === 0 || id.indexOf('ev:sim') === 0) { confetti(120); chime('big'); }
      if (id === 'review' || id === 'quran') { if (qualifies(k)) setTimeout(() => toast(`${icon('link')}<span>Minimum terpenuhi. Rantai aman hari ini.</span>`, null, 2600), 300); }
    }
    afterChange(k, was, null);
  }

  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t || t.disabled) return;
    const a = t.dataset.act, k = t.dataset.k || appKey(now());
    switch (a) {
      case 'log': logSession(k, t.dataset.s, t); break;
      case 'unlog': unlogSession(k, t.dataset.s); break;
      case 'toggle': toggleCheck(k, t.dataset.id, t); break;
      case 'tab': go(t.dataset.tab); break;
      case 'min': { const dd = dayW(k); dd.min = !dd.min; if (!dd.min) delete dd.min; save(); render(true); toast(dd.min ? 'Mode hari minimum aktif. Yang penting tidak putus.' : 'Target penuh kembali.'); break; }
      case 'undo': if (lastUndo) { const f = lastUndo; lastUndo = null; f(); } break;
      case 'welcome-ok': S.welcomed = true; save(); render(true); break;
      case 'save-niat': { const v = ($('#niat-in') || {}).value; if (v && v.trim()) { dayW(k).niat = v.trim(); save(); toast(`${icon('target')}<span>Niat tersimpan. Bismillah.</span>`); afterChange(k, true, null); } break; }
      case 'save-win': { const v = ($('#win-in') || {}).value; if (v && v.trim()) { dayW(k).win = v.trim(); save(); toast(`${icon('star')}<span>Kemenangan dicatat.</span>`); afterChange(k, true, null); } break; }
      case 'save-eval': S.evals[k] = { a: ($('#ev-a') || {}).value || '', b: ($('#ev-b') || {}).value || '' }; save(); toast('Evaluasi pekan tersimpan.'); render(true); break;
      case 'save-note': { const v = ($('#note-' + k) || {}).value || ''; const dd = dayW(k); if (v.trim()) dd.note = v.trim(); else delete dd.note; save(); toast('Catatan tersimpan.'); render(true); break; }
      case 'tl-open': tlOpen = tlOpen === k ? '' : k; render(true); break;
      case 'tl-view': tlView = t.dataset.v || 'tanggal'; if (tab !== 'timeline') go('timeline'); else render(true); break;
      case 'go-week': weekSel = k; go('pekan'); break;
      case 'wk-day': weekSel = k; render(true); break;
      case 'wk-prev': case 'wk-next': {
        const base = weekSel || appKey(now());
        let nk = addDays(base, a === 'wk-prev' ? -7 : 7);
        if (nk < D.START) nk = D.START;
        if (nk > D.END) nk = D.END;
        weekSel = nk; render(true); break;
      }
      case 'map-inc': case 'map-dec': {
        const s = t.dataset.s, m = mapOf(s), today = appKey(now());
        const nd = clamp(m.done + (a === 'map-inc' ? 1 : -1), 0, m.total || 0);
        const hist = m.hist.slice();
        if (!hist.length) hist.push([today, nd, m.done]);
        S.map[s] = { total: m.total, unit: m.unit, done: nd, hist };
        save();
        if (a === 'map-inc') { floatXP(t, '+1'); chime('small'); if (nd === m.total) { confetti(90); toast(`${icon('check')}<span>${esc(SUB[s].name)}: putaran pertama tuntas.</span>`, null, 3000); } }
        checkBadges(stats(today)); render(true); break;
      }
      case 'map-edit': mapEdit = mapEdit === t.dataset.s ? null : t.dataset.s; render(true); break;
      case 'map-cancel': mapEdit = null; render(true); break;
      case 'map-save': {
        const s = t.dataset.s, m = mapOf(s);
        const tot = clamp(parseInt(($('#mt-' + s) || {}).value, 10) || 0, 0, 999);
        const unit = ((($('#mu-' + s) || {}).value) || m.unit).trim().slice(0, 16) || m.unit;
        S.map[s] = { total: tot, unit, done: Math.min(m.done, tot), hist: m.hist };
        mapEdit = null; save(); checkBadges(stats(appKey(now()))); render(true); break;
      }
      case 'bahts-st': {
        const it = S.bahts.items[+t.dataset.i], j = +t.dataset.j;
        it.st[j] = it.st[j] ? 0 : 1;
        popId = it.st[j] ? 'st:' + t.dataset.i + ':' + j : null;
        save();
        if (it.st[j]) { floatXP(t, '+10 XP'); chime('small'); if (j === 3) { confetti(110); toast(`${icon('pen')}<span>${esc(it.name)} final. Satu beban terangkat.</span>`, null, 3000); } }
        afterChange(appKey(now()), true, null); break;
      }
      case 'sound': S.settings.sound = !S.settings.sound; save(); if (S.settings.sound) chime('small'); render(true); break;
      case 'io': ioOpen = !ioOpen; render(true); break;
      case 'copy': {
        const ta = $('#io-text');
        const txt = JSON.stringify(S);
        const done = () => toast('Data tersalin.');
        const fallback = () => { if (ta) { ta.focus(); ta.select(); } toast('Teks sudah dipilih; salin manual.'); };
        try { navigator.clipboard.writeText(txt).then(done, fallback); } catch (e) { fallback(); }
        break;
      }
      case 'share': {
        try {
          const f = new File([JSON.stringify(S)], `dawam-${appKey(now())}.json`, { type: 'application/json' });
          if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Cadangan DAWAM' }).catch(() => {});
          else toast('Perangkat ini belum mendukung berbagi file. Pakai Salin.');
        } catch (e) { toast('Gagal membagikan. Pakai Salin.'); }
        break;
      }
      case 'import': {
        try {
          const obj = JSON.parse(($('#io-text') || {}).value || '');
          if (!obj || typeof obj !== 'object' || !obj.days) throw new Error('format');
          S = Object.assign(fresh(), obj); _pc = {}; save(); ioOpen = false; toast('Data dipulihkan.'); render(true);
        } catch (e) { toast('Teksnya bukan cadangan DAWAM yang valid.'); }
        break;
      }
      case 'reset': resetAsk = true; render(true); break;
      case 'reset-no': resetAsk = false; render(true); break;
      case 'reset-yes': S = fresh(); _pc = {}; resetAsk = false; save(); toast('Progres dihapus.'); go('hari-ini'); render(true); break;
      case 'modal-close': closeModal(); break;
      default: break;
    }
  });
  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (!t.dataset || !t.dataset.change) return;
    if (t.dataset.change === 'bahts-dl' && /^\d{4}-\d{2}-\d{2}$/.test(t.value)) { S.bahts.deadline = t.value; _pc = {}; save(); toast('Batas bahts diperbarui.'); render(true); }
    if (t.dataset.change === 'bahts-name') { const i = +t.dataset.i; S.bahts.items[i].name = (t.value || '').trim().slice(0, 40) || 'Bahts ' + (i + 1); save(); }
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !$('#modal').hidden) closeModal();
    if (ev.key === 'Enter' && ev.target && ev.target.id === 'niat-in') $('[data-act="save-niat"]').click();
    if (ev.key === 'Enter' && ev.target && ev.target.id === 'win-in') $('[data-act="save-win"]').click();
  });
  $('#modal').addEventListener('click', (ev) => { if (ev.target.id === 'modal') closeModal(); });

  /* ================= mulai ================= */
  window.addEventListener('hashchange', () => { readHash(); render(true); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  readHash();
  S.lvl = Math.max(S.lvl || 0, 0);
  checkBadges(stats(appKey(now())), true);
  render(true);
  if (tab === 'timeline') { const row = $('.tl-row.today'); if (row) setTimeout(() => row.scrollIntoView({ block: 'center' }), 60); }
  setInterval(() => { if ($('#modal').hidden) render(); }, 20000);

  // PWA: hanya didaftarkan pada versi yang punya manifest (GitHub Pages), bukan di pratinjau.
  if (document.querySelector('link[rel="manifest"]') && 'serviceWorker' in navigator && location.protocol === 'https:') {
    try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) { /* abaikan */ }
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* abaikan */ }
  }
  window.DAWAM_DEBUG = { plan, recommend, targets, S: () => S, stats };
})();
