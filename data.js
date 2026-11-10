/* DAWAM · data jadwal & rencana belajar
   Semua jam = waktu lokal perangkat (Madinah, UTC+3).
   Ubah jadwal di file ini; aplikasi membaca semuanya dari sini. */
(function () {
  'use strict';

  const START = '2026-11-09';
  const END = '2026-12-10';
  const BAHTS_DEADLINE = '2026-11-19'; // asumsi: pekan kedua sebelum UAS (bisa diubah di aplikasi)

  const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
  const B = (s, e, type, label, cap, extra) =>
    Object.assign({ s: toMin(s), e: toMin(e), type, label, cap: cap || 0 }, extra || {});

  /* ---------- Mata kuliah ---------- */
  const SUBJECTS = {
    FAR: { name: 'Faraidh',  full: 'Al-Faraidh 3',                      ar: 'الفرائض 3',                       color: '#8B5CF6', unit: 'video',   total: 49, due: '2026-11-22' },
    MUA: { name: 'Muamalat', full: 'Fiqih Muamalat 1',                  ar: 'فقه المعاملات 1',                 color: '#06B6D4', unit: 'masalah', total: 0,  due: '2026-11-24' },
    USR: { name: 'Usroh',    full: 'Fiqih Usroh 1',                     ar: 'فقه الأسرة 1',                    color: '#EC4899', unit: 'masalah', total: 0,  due: '2026-11-24' },
    ADL: { name: 'Adilah',   full: 'Adilatul Ahkam 2',                  ar: 'أدلة الأحكام 2',                  color: '#3B82F6', unit: 'bab',     total: 0,  due: '2026-12-03' },
    NZM: { name: 'Nizhom',   full: 'Nizhom Ijroat Jazaiyyah',           ar: 'نظام الإجراءات الجزائية',         color: '#EAB308', unit: 'halaman', total: 50, due: '2026-12-07' },
    UQD: { name: 'Uqud',     full: 'Uqud Tijariyah wa Amaliyat Bunuk',  ar: 'العقود التجارية وعمليات البنوك', color: '#F97316', unit: 'bab',     total: 0,  due: '2026-12-08' },
    QUR: { name: "Qur'an",   full: "Al-Qur'an al-Karim 6",              ar: 'القرآن الكريم 6',                 color: '#22C55E', unit: 'halaman', total: 0,  due: '2026-11-25' },
  };
  const ORDER = ['FAR', 'MUA', 'USR', 'ADL', 'NZM', 'UQD', 'QUR'];

  /* ---------- Jadwal UAS (dari lembar jadwal resmi) ---------- */
  const EXAMS = [
    { id: 'MUA', date: '2026-11-29', s: '10:30', e: '12:30', room: '114 Syariah', code: 'فقه 3401' },
    { id: 'USR', date: '2026-11-29', s: '13:00', e: '15:00', room: '05 Syariah',  code: 'فقه 3304' },
    { id: 'FAR', date: '2026-12-01', s: '10:30', e: '12:30', room: '114 Syariah', code: 'فقه 3402' },
    { id: 'QUR', date: '2026-12-03', s: '10:30', e: '12:30', room: '11 Syariah',  code: 'قرأ 3006' },
    { id: 'ADL', date: '2026-12-06', s: '08:00', e: '10:00', room: '114 Syariah', code: 'أصل 3202' },
    { id: 'NZM', date: '2026-12-09', s: '08:00', e: '10:00', room: '112 Syariah', code: 'نظم 3005' },
    { id: 'UQD', date: '2026-12-10', s: '08:00', e: '10:00', room: '116 Syariah', code: 'نظم 3010' },
  ];

  /* ---------- Blok rutin ---------- */
  const RUTIN = B('05:00', '06:00', 'rutin', 'Bangun · Subuh · dzikir pagi');
  const RUTIN_S = B('05:00', '05:45', 'rutin', 'Bangun · Subuh · dzikir pagi');
  const QURAN_S = B('05:45', '06:40', 'quran', "Qur'an");
  const MORNING = B('06:00', '07:45', 'morning', "Qur'an · uji ingatan · sarapan", 1);
  const REVIEW = B('21:30', '22:00', 'review', 'Review & rencana besok');
  const WIND = B('22:00', '22:30', 'winddown', 'Mode redup · siap tidur');

  /* ---------- Template pekanan (0 = Ahad … 6 = Sabtu) ---------- */
  const WEEK = {
    0: [ // Ahad
      RUTIN, MORNING,
      B('08:00', '11:00', 'class', 'Kuliah'),
      B('11:00', '12:30', 'workout', 'Workout'),
      B('12:30', '13:30', 'rest', 'Zuhur · makan siang · qailulah'),
      B('13:30', '15:20', 'study', 'Belajar', 3),
      B('15:20', '15:50', 'rest', 'Ashar · rehat'),
      B('15:50', '16:50', 'study', 'Belajar', 2),
      B('17:00', '19:00', 'class', 'Kuliah'),
      B('19:00', '20:10', 'rest', 'Isya · makan malam'),
      B('20:10', '21:10', 'study', 'Belajar', 2),
      REVIEW, WIND,
    ],
    1: [ // Senin (rest day workout)
      RUTIN, MORNING,
      B('08:00', '10:00', 'class', 'Kuliah'),
      B('10:00', '11:00', 'study', 'Belajar', 2),
      B('11:00', '13:05', 'rest', 'Makan siang · Zuhur · qailulah'),
      B('13:05', '15:20', 'study', 'Belajar', 4),
      B('15:20', '16:00', 'rest', 'Ashar · berangkat'),
      B('16:00', '18:00', 'class', 'Kuliah'),
      B('18:00', '19:00', 'study', 'Belajar', 2),
      B('19:00', '20:00', 'rest', 'Isya · makan malam'),
      B('20:00', '21:30', 'study', 'Belajar', 3),
      REVIEW, WIND,
    ],
    2: [ // Selasa
      RUTIN, MORNING,
      B('08:00', '10:00', 'class', 'Kuliah'),
      B('10:00', '11:30', 'workout', 'Workout'),
      B('11:30', '13:05', 'rest', 'Makan siang · Zuhur · qailulah'),
      B('13:05', '15:20', 'study', 'Belajar', 4),
      B('15:20', '15:50', 'rest', 'Ashar · rehat'),
      B('15:50', '17:20', 'bahts', 'Bahts'),
      B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
      B('18:00', '19:00', 'study', 'Belajar', 2),
      B('19:00', '20:00', 'rest', 'Isya · makan malam'),
      B('20:00', '21:30', 'study', 'Belajar', 3),
      REVIEW, WIND,
    ],
    3: [ // Rabu
      RUTIN, MORNING,
      B('08:00', '10:00', 'class', 'Kuliah'),
      B('10:00', '11:00', 'study', 'Belajar', 2),
      B('11:00', '13:00', 'rest', 'Makan siang · Zuhur · rehat'),
      B('13:00', '17:00', 'class', 'Kuliah'),
      B('17:00', '18:30', 'workout', 'Workout'),
      B('18:30', '20:00', 'rest', 'Maghrib · Isya · makan malam'),
      B('20:00', '21:30', 'study', 'Belajar', 3),
      REVIEW, WIND,
    ],
    4: [ // Kamis (rest day workout)
      RUTIN, MORNING,
      B('08:00', '09:00', 'class', 'Kuliah'),
      B('09:00', '11:00', 'study', 'Belajar', 4),
      B('11:00', '13:05', 'rest', 'Makan siang · Zuhur · qailulah'),
      B('13:05', '14:35', 'bahts', 'Bahts'),
      B('14:35', '15:00', 'rest', 'Persiapan kuliah'),
      B('15:00', '17:00', 'class', 'Kuliah'),
      B('17:00', '18:00', 'rest', 'Maghrib · rehat'),
      B('18:00', '19:00', 'study', 'Belajar', 2),
      B('19:00', '20:00', 'rest', 'Isya · makan malam'),
      B('20:00', '21:30', 'study', 'Belajar', 3),
      REVIEW, WIND,
    ],
    5: [ // Jumat
      RUTIN_S, QURAN_S,
      B('06:45', '08:15', 'workout', 'Workout'),
      B('08:15', '08:45', 'rest', 'Sarapan · mandi'),
      B('08:45', '10:40', 'study', 'Belajar', 4),
      B('10:40', '13:50', 'rest', 'Al-Kahfi · Jumatan · makan siang · qailulah'),
      B('13:50', '15:15', 'study', 'Belajar', 3),
      B('15:15', '21:30', 'free', 'Bebas total'),
      B('21:30', '22:00', 'review', 'Rencana besok · ringan'),
      WIND,
    ],
    6: [ // Sabtu
      RUTIN_S, QURAN_S,
      B('06:45', '08:15', 'workout', 'Workout'),
      B('08:15', '08:45', 'rest', 'Sarapan · mandi'),
      B('08:45', '10:40', 'study', 'Belajar', 4),
      B('11:00', '12:00', 'bahts', 'Bahts'),
      B('12:00', '13:35', 'rest', 'Zuhur · makan siang · qailulah'),
      B('13:35', '15:00', 'study', 'Belajar', 3),
      B('15:00', '15:50', 'rest', 'Ashar · rehat'),
      B('15:50', '17:20', 'study', 'Belajar', 3),
      B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
      B('18:00', '19:00', 'study', 'Belajar', 2),
      B('19:00', '20:00', 'rest', 'Isya · makan malam'),
      B('20:00', '21:00', 'reserve', 'Cadangan + evaluasi pekan', 2),
      REVIEW, WIND,
    ],
  };

  /* ---------- Hari khusus: simulasi ---------- */
  const SIM1 = [ // Sabtu 21 Nov
    RUTIN_S, QURAN_S,
    B('06:45', '08:15', 'workout', 'Workout'),
    B('08:15', '08:45', 'rest', 'Sarapan · mandi'),
    B('08:45', '09:45', 'study', 'Pemanasan Faraidh', 2, { pref: ['FAR'] }),
    B('09:45', '10:30', 'rest', 'Rehat · siapkan meja ujian'),
    B('10:30', '12:30', 'sim', 'Simulasi · Muamalat (tutup buku)'),
    B('12:30', '13:00', 'rest', 'Zuhur · jeda seperti hari H'),
    B('13:00', '15:00', 'sim', 'Simulasi · Usroh (tutup buku)'),
    B('15:00', '15:50', 'rest', 'Ashar · makan · rehat'),
    B('15:50', '17:20', 'study', 'Koreksi simulasi pakai kitab', 3, { pref: ['MUA', 'USR'] }),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Belajar', 2, { pref: ['FAR'] }),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:00', 'reserve', 'Cadangan + evaluasi pekan', 2),
    REVIEW, WIND,
  ];
  const SIM2 = [ // Selasa 24 Nov · gladi bersih di jam ujian asli
    RUTIN,
    B('06:00', '07:45', 'morning', "Qur'an · kartu ✗ · sarapan", 1, { pref: ['MUA', 'USR'] }),
    B('08:00', '10:00', 'class', 'Kuliah'),
    B('10:00', '10:30', 'rest', 'Siapkan meja simulasi'),
    B('10:30', '12:30', 'sim', 'Simulasi 2 · Muamalat'),
    B('12:30', '13:00', 'rest', 'Zuhur · jeda'),
    B('13:00', '15:00', 'sim', 'Simulasi 2 · Usroh'),
    B('15:00', '15:50', 'rest', 'Ashar · makan · rehat'),
    B('15:50', '17:20', 'workout', 'Workout (digeser)'),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Koreksi simulasi', 2, { pref: ['MUA', 'USR'] }),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3, { pref: ['FAR'] }),
    REVIEW, WIND,
  ];

  /* ---------- Masa UAS: hari tenang & hari ujian ---------- */
  const CALM_MON = [
    RUTIN, MORNING,
    B('08:00', '10:00', 'study', 'Belajar', 4),
    B('10:00', '10:20', 'rest', 'Rehat · jalan sebentar'),
    B('10:20', '12:00', 'study', 'Belajar', 3),
    B('12:00', '13:30', 'rest', 'Zuhur · makan siang · qailulah'),
    B('13:30', '15:10', 'study', 'Belajar', 3),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:20', 'study', 'Belajar', 3),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Belajar', 2),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const CALM_TUE = [
    RUTIN, MORNING,
    B('08:00', '10:00', 'study', 'Belajar', 4),
    B('10:00', '11:30', 'workout', 'Workout'),
    B('11:30', '13:30', 'rest', 'Makan siang · Zuhur · qailulah'),
    B('13:30', '15:10', 'study', 'Belajar', 3),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:20', 'study', 'Belajar', 3),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Belajar', 2),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const CALM_WED = [
    RUTIN, MORNING,
    B('08:00', '10:00', 'study', 'Belajar', 4),
    B('10:00', '10:20', 'rest', 'Rehat · jalan sebentar'),
    B('10:20', '12:00', 'study', 'Belajar', 3),
    B('12:00', '13:30', 'rest', 'Zuhur · makan siang · qailulah'),
    B('13:30', '15:10', 'study', 'Belajar', 3),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:00', 'study', 'Belajar', 2),
    B('17:00', '18:30', 'workout', 'Workout'),
    B('18:30', '20:00', 'rest', 'Maghrib · Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const FRI_UAS = [
    RUTIN_S, QURAN_S,
    B('06:45', '08:15', 'workout', 'Workout'),
    B('08:15', '08:45', 'rest', 'Sarapan · mandi'),
    B('08:45', '10:40', 'study', 'Belajar', 4),
    B('10:40', '13:50', 'rest', 'Al-Kahfi · Jumatan · makan siang · qailulah'),
    B('13:50', '15:15', 'study', 'Belajar', 3),
    B('15:15', '18:00', 'free', 'Bebas · Ashar sampai Maghrib'),
    B('18:00', '19:00', 'study', 'Belajar', 2),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const SAT_UAS = [
    RUTIN_S, QURAN_S,
    B('06:45', '08:15', 'workout', 'Workout'),
    B('08:15', '08:45', 'rest', 'Sarapan · mandi'),
    B('08:45', '10:40', 'study', 'Belajar', 4),
    B('11:00', '12:00', 'study', 'Belajar', 2),
    B('12:00', '13:35', 'rest', 'Zuhur · makan siang · qailulah'),
    B('13:35', '15:00', 'study', 'Belajar', 3),
    B('15:00', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:20', 'study', 'Belajar', 3),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Belajar', 2),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:00', 'study', 'Review ringan', 2),
    REVIEW, WIND,
  ];
  const EXAM_29 = [ // Ahad 29 Nov · Muamalat + Usroh
    RUTIN,
    B('06:00', '07:45', 'morning', "Qur'an ringan · kartu ✗ · sarapan", 1, { pref: ['MUA'] }),
    B('07:45', '09:15', 'study', 'Review ringan · kartu ✗ saja', 3, { pref: ['MUA', 'USR'] }),
    B('09:15', '10:30', 'rest', 'Siap-siap · berangkat · tenangkan diri'),
    B('10:30', '12:30', 'exam', 'Ujian Muamalat', 0, { sub: 'MUA' }),
    B('12:30', '13:00', 'rest', 'Zuhur · pindah ke ruang 05'),
    B('13:00', '15:00', 'exam', 'Ujian Usroh', 0, { sub: 'USR' }),
    B('15:00', '17:30', 'rest', 'Ashar · makan · rehat total'),
    B('17:30', '18:00', 'rest', 'Maghrib'),
    B('18:00', '19:00', 'study', 'Faraidh · soal campuran', 2, { pref: ['FAR'] }),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Faraidh', 3, { pref: ['FAR'] }),
    REVIEW, WIND,
  ];
  const EXAM_FAR = [ // Selasa 1 Des
    RUTIN,
    B('06:00', '07:45', 'morning', "Qur'an · 2 soal pemanasan · sarapan", 1, { pref: ['FAR'] }),
    B('07:45', '09:15', 'study', 'Pemanasan ringan · kasus ✗', 3, { pref: ['FAR'] }),
    B('09:15', '10:30', 'rest', 'Siap-siap · berangkat · tenangkan diri'),
    B('10:30', '12:30', 'exam', 'Ujian Faraidh', 0, { sub: 'FAR' }),
    B('12:30', '13:30', 'rest', 'Zuhur · makan siang'),
    B('13:30', '15:10', 'study', "Murajaah Qur'an", 3, { pref: ['QUR'] }),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:20', 'workout', 'Workout (digeser)'),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', "Murajaah Qur'an", 2, { pref: ['QUR'] }),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const EXAM_QUR = [ // Kamis 3 Des
    RUTIN,
    B('06:00', '07:45', 'morning', 'Murajaah ringan · sarapan', 1, { pref: ['QUR'] }),
    B('07:45', '09:15', 'study', 'Murajaah bagian yang tersendat', 3, { pref: ['QUR'] }),
    B('09:15', '10:30', 'rest', 'Siap-siap · berangkat · tenangkan diri'),
    B('10:30', '12:30', 'exam', "Ujian Al-Qur'an", 0, { sub: 'QUR' }),
    B('12:30', '13:30', 'rest', 'Zuhur · makan siang'),
    B('13:30', '15:10', 'study', 'Belajar', 3, { pref: ['ADL'] }),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:20', 'study', 'Belajar', 3),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Belajar', 2),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const EXAM_ADL = [ // Ahad 6 Des
    RUTIN,
    B('06:00', '07:15', 'morning', "Qur'an ringan · kartu ✗ · sarapan", 1, { pref: ['ADL'] }),
    B('07:15', '08:00', 'rest', 'Berangkat · tenangkan diri'),
    B('08:00', '10:00', 'exam', 'Ujian Adilah', 0, { sub: 'ADL' }),
    B('10:00', '11:00', 'rest', 'Rehat · pulang'),
    B('11:00', '12:30', 'workout', 'Workout'),
    B('12:30', '13:30', 'rest', 'Zuhur · makan siang'),
    B('13:30', '15:10', 'study', 'Belajar', 3, { pref: ['NZM'] }),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:20', 'study', 'Belajar', 3),
    B('17:20', '18:00', 'rest', 'Maghrib · rehat'),
    B('18:00', '19:00', 'study', 'Belajar', 2),
    B('19:00', '20:00', 'rest', 'Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const EXAM_NZM = [ // Rabu 9 Des
    RUTIN,
    B('06:00', '07:15', 'morning', "Qur'an ringan · kartu ✗ · sarapan", 1, { pref: ['NZM'] }),
    B('07:15', '08:00', 'rest', 'Berangkat · tenangkan diri'),
    B('08:00', '10:00', 'exam', 'Ujian Nizhom', 0, { sub: 'NZM' }),
    B('10:00', '11:00', 'rest', 'Rehat · pulang'),
    B('11:00', '12:00', 'study', 'Belajar', 2, { pref: ['UQD'] }),
    B('12:00', '13:30', 'rest', 'Zuhur · makan siang · qailulah'),
    B('13:30', '15:10', 'study', 'Belajar', 3),
    B('15:10', '15:50', 'rest', 'Ashar · rehat'),
    B('15:50', '17:00', 'study', 'Belajar', 2),
    B('17:00', '18:30', 'workout', 'Workout'),
    B('18:30', '20:00', 'rest', 'Maghrib · Isya · makan malam'),
    B('20:00', '21:30', 'study', 'Belajar', 3),
    REVIEW, WIND,
  ];
  const EXAM_UQD = [ // Kamis 10 Des · ujian terakhir
    RUTIN,
    B('06:00', '07:15', 'morning', "Qur'an ringan · kartu ✗ · sarapan", 1, { pref: ['UQD'] }),
    B('07:15', '08:00', 'rest', 'Berangkat · tenangkan diri'),
    B('08:00', '10:00', 'exam', 'Ujian Uqud', 0, { sub: 'UQD' }),
    B('10:00', '22:00', 'free', 'Khatam UAS · Alhamdulillah'),
    WIND,
  ];

  /* ---------- Rencana per tanggal ----------
     t  = target sesi (25 menit) per matkul
     o  = urutan prioritas · m = 'rr' (bergiliran per 2 sesi) | 'seq' (berurutan)
     cv = ubah blok di jam itu menjadi 'study' / 'bahts'
     ev = event; close:true → begitu dicentang, sisa sesi matkul itu dialihkan
     tk = tugas khusus · n = catatan · mn = matkul untuk Mode Hari Minimum
     nd = matkul yang tidak dibawa ke cadangan Sabtu (persiapan UTS yang sudah lewat) */
  const DAYS = {
    '2026-11-09': { ph: 0, nd: ['ADL', 'NZM'], from: '11:30', t: { ADL: 5, FAR: 2 }, o: ['ADL', 'FAR'], m: 'seq',
      tk: [['inv', 'Inventaris materi 7 matkul, isi di Peta Materi'], ['far-map', 'Petakan 49 video Faraidh: wajib, Faraidh 3, lewati']],
      n: 'Hari pertama. Inventaris dulu, lalu fokus Adilah untuk UTS Rabu.' },
    '2026-11-10': { ph: 0, nd: ['ADL', 'NZM'], t: { ADL: 6, NZM: 2, FAR: 2 }, o: ['ADL', 'NZM', 'FAR'], m: 'seq', cv: { '15:50': 'study' },
      n: 'Besok UTS Adilah (pilihan ganda). Slot bahts dipakai untuk UTS dulu; bahts mulai Jumat.' },
    '2026-11-11': { ph: 0, nd: ['ADL', 'NZM'], t: { ADL: 2, NZM: 2, FAR: 2 }, o: ['ADL', 'NZM', 'FAR'], m: 'seq',
      ev: [{ id: 'uts-adl-1', label: 'UTS Adilah · pilihan ganda', kind: 'uts', sub: 'ADL' }],
      n: 'Hari UTS. Malam ini siapkan esai Adilah dan Nizhom untuk besok.' },
    '2026-11-12': { ph: 0, nd: ['ADL', 'NZM'], t: { ADL: 3, NZM: 3, FAR: 2, MUA: 2 }, o: ['ADL', 'NZM', 'FAR', 'MUA'], m: 'seq', cv: { '13:05': 'study' },
      ev: [{ id: 'uts-adl-2', label: 'UTS Adilah · esai', kind: 'uts', sub: 'ADL', close: true },
           { id: 'uts-nzm', label: 'UTS Nizhom', kind: 'uts', sub: 'NZM', close: true }],
      n: 'Centang UTS begitu selesai; sisa sesinya otomatis pindah ke matkul berikutnya. Malam ini Bidayah dimulai.' },

    '2026-11-13': { ph: 1, t: { FAR: 2, UQD: 2 }, o: ['FAR', 'UQD'], cv: { '13:50': 'bahts' },
      tk: [['bahts-map', 'Petakan 3 bahts: topik, kerangka, referensi awal']],
      n: 'Transisi setelah UTS. Putaran penuh Uqud bagian 1. Sprint bahts dimulai. Ba\'da Ashar bebas.' },
    '2026-11-14': { ph: 1, t: { FAR: 3, USR: 2, UQD: 2, MUA: 1 }, o: ['FAR', 'USR', 'UQD', 'MUA'], cv: { '15:50': 'bahts' },
      n: 'Uqud bagian 2: satu putaran penuh tuntas. Malam: evaluasi pekan.' },
    '2026-11-15': { ph: 1, t: { FAR: 3, MUA: 2, ADL: 1 }, o: ['FAR', 'MUA', 'ADL'] },
    '2026-11-16': { ph: 1, t: { FAR: 4, USR: 3, MUA: 2 }, o: ['FAR', 'USR', 'MUA'], cv: { '18:00': 'bahts' } },
    '2026-11-17': { ph: 1, t: { FAR: 3, MUA: 3, USR: 1, NZM: 1 }, o: ['FAR', 'MUA', 'USR', 'NZM'] },
    '2026-11-18': { ph: 1, t: { FAR: 2, USR: 2, NZM: 1 }, o: ['FAR', 'USR', 'NZM'] },
    '2026-11-19': { ph: 1, t: { FAR: 3, MUA: 3, USR: 2 }, o: ['FAR', 'MUA', 'USR'],
      ev: [{ id: 'bahts-dl', label: 'Batas bahts (asumsi)', kind: 'deadline' }] },
    '2026-11-20': { ph: 1, t: { FAR: 3, USR: 2, MUA: 1 }, o: ['FAR', 'USR', 'MUA'],
      n: 'Besok simulasi 1. Malam ini tidur tepat waktu.' },
    '2026-11-21': { ph: 1, blocks: SIM1, t: { FAR: 4, MUA: 2, USR: 1 }, o: ['FAR', 'MUA', 'USR'], m: 'seq',
      ev: [{ id: 'sim1', label: 'Simulasi 1 · Muamalat + Usroh', kind: 'sim' }],
      n: 'Persis format hari H: 10:30–12:30, jeda 30 menit, 13:00–15:00, tutup buku. Sore: koreksi pakai kitab, catat celahnya.' },

    '2026-11-22': { ph: 2, t: { FAR: 3, USR: 2, ADL: 1 }, o: ['FAR', 'USR', 'ADL'],
      tk: [['gap', 'Ubah celah dari simulasi 1 menjadi kartu ✗']],
      n: 'Faraidh mulai latihan soal campuran (jenis diacak).' },
    '2026-11-23': { ph: 2, t: { FAR: 4, MUA: 3, USR: 2, NZM: 1 }, o: ['FAR', 'MUA', 'USR', 'NZM'] },
    '2026-11-24': { ph: 2, blocks: SIM2, t: { MUA: 2, USR: 1, FAR: 3 }, o: ['MUA', 'USR', 'FAR'], m: 'seq', mn: 'FAR',
      ev: [{ id: 'sim2', label: 'Simulasi 2 · gladi bersih', kind: 'sim' }],
      n: 'Gladi bersih di jam ujian asli. Workout digeser ke 15:50.' },
    '2026-11-25': { ph: 2, t: { FAR: 2, MUA: 2, USR: 1 }, o: ['FAR', 'MUA', 'USR'],
      tk: [['qur-new', "Hafalan baru Qur'an tuntas"]],
      n: "Mulai besok Qur'an tinggal murajaah." },
    '2026-11-26': { ph: 2, t: { FAR: 4, USR: 3, MUA: 3 }, o: ['FAR', 'USR', 'MUA'] },
    '2026-11-27': { ph: 2, t: { FAR: 2, MUA: 2, USR: 2 }, o: ['FAR', 'MUA', 'USR'] },
    '2026-11-28': { ph: 2, t: { MUA: 3, USR: 2, FAR: 1 }, o: ['MUA', 'USR', 'FAR'], m: 'seq', light: true,
      tk: [['kit', 'Siapkan perlengkapan ujian besok']],
      n: 'Hari ringan: hanya kartu ✗ dan ~, tanpa materi baru. Tidur tepat waktu.' },

    '2026-11-29': { ph: 3, blocks: EXAM_29, t: { MUA: 2, USR: 2, FAR: 5 }, o: ['MUA', 'USR', 'FAR'], m: 'seq', mn: 'FAR',
      n: 'Dua ujian dalam sehari. Di jeda 30 menit: shalat, minum, jangan buka materi baru.' },
    '2026-11-30': { ph: 3, blocks: CALM_MON, t: { FAR: 9, ADL: 1 }, o: ['FAR', 'ADL'], m: 'seq',
      n: 'Hari Faraidh: soal campuran, jenis diacak. Besok ujian.' },
    '2026-12-01': { ph: 3, blocks: EXAM_FAR, t: { FAR: 3, QUR: 6 }, o: ['FAR', 'QUR'], m: 'seq', mn: 'QUR' },
    '2026-12-02': { ph: 3, blocks: CALM_WED, t: { QUR: 8, ADL: 2 }, o: ['QUR', 'ADL'], m: 'seq',
      n: "Hari Qur'an: murajaah per halaman, minta teman menyimak bila bisa." },
    '2026-12-03': { ph: 3, blocks: EXAM_QUR, t: { QUR: 3, ADL: 6 }, o: ['QUR', 'ADL'], m: 'seq', mn: 'ADL' },
    '2026-12-04': { ph: 3, blocks: FRI_UAS, t: { ADL: 7, NZM: 1 }, o: ['ADL', 'NZM'], m: 'seq' },
    '2026-12-05': { ph: 3, blocks: SAT_UAS, t: { ADL: 9, NZM: 1 }, o: ['ADL', 'NZM'], m: 'seq',
      n: 'Besok Adilah jam 08:00. Tidur tepat waktu.' },
    '2026-12-06': { ph: 3, blocks: EXAM_ADL, t: { ADL: 1, NZM: 7 }, o: ['ADL', 'NZM'], m: 'seq', mn: 'NZM' },
    '2026-12-07': { ph: 3, blocks: CALM_MON, t: { NZM: 8, UQD: 2 }, o: ['NZM', 'UQD'], m: 'seq' },
    '2026-12-08': { ph: 3, blocks: CALM_TUE, t: { NZM: 8, UQD: 1 }, o: ['NZM', 'UQD'], m: 'seq',
      n: 'Besok Nizhom jam 08:00. Tidur tepat waktu.' },
    '2026-12-09': { ph: 3, blocks: EXAM_NZM, t: { NZM: 1, UQD: 9 }, o: ['NZM', 'UQD'], m: 'seq', mn: 'UQD',
      n: 'Ujian terakhir besok jam 08:00. Uqud: istilah dan studi kasus.' },
    '2026-12-10': { ph: 3, blocks: EXAM_UQD, t: { UQD: 1 }, o: ['UQD'], m: 'seq', last: true },
  };

  const PHASES = [
    { id: 0, name: 'Pekan UTS',   range: '9–12 Nov',        desc: 'UTS Adilah dan Nizhom dulu. Faraidh tetap jalan minimal 2 sesi.' },
    { id: 1, name: 'Fondasi',     range: '13–21 Nov',       desc: 'Faraidh 3–4 sesi, Bidayah 3–4 sesi, satu matkul ringan bergilir. Sprint bahts sampai 19 Nov.' },
    { id: 2, name: 'Pemantapan',  range: '22–28 Nov',       desc: 'Faraidh latihan soal campuran, Bidayah tanpa buka buku. Gladi bersih 24 Nov.' },
    { id: 3, name: 'Masa UAS',    range: '29 Nov – 10 Des', desc: 'Satu ujian, satu fokus. Hari tenang di sela ujian.' },
  ];

  const LEVELS = [
    { xp: 0,    ar: 'مبتدئ',  name: "Mubtadi'", desc: 'Pemula yang sudah melangkah' },
    { xp: 250,  ar: 'طالب',   name: 'Thalib',   desc: 'Penuntut ilmu' },
    { xp: 700,  ar: 'مُجِدّ',  name: 'Mujidd',   desc: 'Yang bersungguh-sungguh' },
    { xp: 1400, ar: 'مُتقِن',  name: 'Mutqin',   desc: 'Yang matang dan teliti' },
    { xp: 2200, ar: 'مُحقِّق', name: 'Muhaqqiq', desc: 'Yang menimbang dan menguji' },
    { xp: 3200, ar: 'راسخ',   name: 'Rasikh',   desc: 'Yang kokoh ilmunya (Ali Imran: 7)' },
  ];

  // Tanggal Hijriah (Umm al-Qura), dihitung sekali agar tidak bergantung pada browser.
  const HIJRI = {"2026-11-08":"28 جمادى الأولى 1448","2026-11-09":"29 جمادى الأولى 1448","2026-11-10":"30 جمادى الأولى 1448","2026-11-11":"1 جمادى الآخرة 1448","2026-11-12":"2 جمادى الآخرة 1448","2026-11-13":"3 جمادى الآخرة 1448","2026-11-14":"4 جمادى الآخرة 1448","2026-11-15":"5 جمادى الآخرة 1448","2026-11-16":"6 جمادى الآخرة 1448","2026-11-17":"7 جمادى الآخرة 1448","2026-11-18":"8 جمادى الآخرة 1448","2026-11-19":"9 جمادى الآخرة 1448","2026-11-20":"10 جمادى الآخرة 1448","2026-11-21":"11 جمادى الآخرة 1448","2026-11-22":"12 جمادى الآخرة 1448","2026-11-23":"13 جمادى الآخرة 1448","2026-11-24":"14 جمادى الآخرة 1448","2026-11-25":"15 جمادى الآخرة 1448","2026-11-26":"16 جمادى الآخرة 1448","2026-11-27":"17 جمادى الآخرة 1448","2026-11-28":"18 جمادى الآخرة 1448","2026-11-29":"19 جمادى الآخرة 1448","2026-11-30":"20 جمادى الآخرة 1448","2026-12-01":"21 جمادى الآخرة 1448","2026-12-02":"22 جمادى الآخرة 1448","2026-12-03":"23 جمادى الآخرة 1448","2026-12-04":"24 جمادى الآخرة 1448","2026-12-05":"25 جمادى الآخرة 1448","2026-12-06":"26 جمادى الآخرة 1448","2026-12-07":"27 جمادى الآخرة 1448","2026-12-08":"28 جمادى الآخرة 1448","2026-12-09":"29 جمادى الآخرة 1448","2026-12-10":"1 رجب 1448","2026-12-11":"2 رجب 1448","2026-12-12":"3 رجب 1448"};

  window.DAWAM_DATA = { START, END, BAHTS_DEADLINE, SUBJECTS, ORDER, EXAMS, WEEK, DAYS, PHASES, LEVELS, HIJRI, toMin };
})();
