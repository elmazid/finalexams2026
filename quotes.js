/* DAWAM · bekal harian (2 per hari: pagi–siang, siang–malam) dan faidah kejutan.
   Standar: ayat dengan surah:ayat; hadits shahih/hasan dengan takhrij; ucapan ulama dengan kitab sumbernya;
   kutipan umum hanya yang atribusinya valid. */
(function () {
  'use strict';
  const Q = (ar, id, src) => ({ k: 'quran', ar, id, src });
  const H = (ar, id, src) => ({ k: 'hadits', ar, id, src });
  const U = (ar, id, src) => ({ k: 'ulama', ar, id, src });
  const G = (id, orig, src) => ({ k: 'umum', id, orig, src });

  const QUOTES = [
    // 0 · Sen 9 Nov
    H('أحبُّ الأعمال إلى الله أدومُها وإن قلّ', 'Amalan yang paling dicintai Allah adalah yang paling konsisten, meskipun sedikit.', 'HR. al-Bukhari 6464, Muslim 783'),
    H('احرِصْ على ما ينفعُك، واستعِنْ بالله ولا تعجِزْ', 'Bersemangatlah meraih yang bermanfaat bagimu, mintalah pertolongan kepada Allah, dan jangan lemah.', 'HR. Muslim 2664'),
    // 1 · Sel 10 Nov
    Q('وقُل ربِّ زِدني علمًا', 'Dan katakanlah: Ya Rabbku, tambahkanlah ilmu kepadaku.', 'QS. Thaha [20]: 114'),
    G('Prinsip pertama: jangan menipu dirimu sendiri, dan dirimulah orang yang paling mudah ditipu.', 'The first principle is that you must not fool yourself, and you are the easiest person to fool.', 'Richard Feynman, pidato wisuda Caltech (1974)'),
    // 2 · Rab 11 Nov · UTS Adilah
    Q('ربِّ اشرَحْ لي صدري • ويسِّرْ لي أمري', 'Ya Rabbku, lapangkanlah dadaku, dan mudahkanlah urusanku.', 'QS. Thaha [20]: 25–26'),
    H('ومَن يتصبَّرْ يُصبِّرْه الله، وما أُعطِيَ أحدٌ عطاءً خيرًا وأوسعَ من الصبر', 'Siapa berusaha sabar, Allah jadikan ia sabar. Tak ada pemberian yang lebih baik dan lebih luas daripada kesabaran.', 'HR. al-Bukhari 1469, Muslim 1053'),
    // 3 · Kam 12 Nov · UTS esai & Nizhom
    Q('فإذا عزمتَ فتوكَّلْ على الله', 'Apabila kamu telah membulatkan tekad, bertawakallah kepada Allah.', 'QS. Ali Imran [3]: 159'),
    Q('فإذا فرغتَ فانصَبْ • وإلى ربِّك فارغَبْ', 'Apabila engkau telah selesai dari satu urusan, bersungguh-sungguhlah pada urusan berikutnya, dan hanya kepada Rabbmu engkau berharap.', 'QS. Al-Insyirah [94]: 7–8'),
    // 4 · Jum 13 Nov
    H('سدِّدوا وقارِبوا وأبشِروا، واستعينوا بالغَدْوة والرَّوْحة وشيءٍ من الدُّلْجة', 'Berlaku luruslah, mendekatlah, dan bergembiralah. Mintalah pertolongan dengan beramal di waktu pagi, sore, dan sedikit di waktu malam.', 'HR. al-Bukhari 39'),
    H('إنَّ لربِّك عليك حقًّا، ولنفسِك عليك حقًّا، ولأهلِك عليك حقًّا، فأعطِ كلَّ ذي حقٍّ حقَّه', 'Rabbmu punya hak atasmu, dirimu punya hak atasmu, keluargamu punya hak atasmu. Tunaikan hak masing-masing.', 'Salman kepada Abu ad-Darda\', dibenarkan Nabi ﷺ · HR. al-Bukhari 1968'),
    // 5 · Sab 14 Nov
    G('Orang boleh pandai setinggi langit, tapi selama ia tak menulis, ia akan hilang di dalam masyarakat dan dari sejarah.', '', 'Pramoedya Ananta Toer, Rumah Kaca'),
    G('Rencana itu tak berharga, tapi merencanakan adalah segalanya.', 'Plans are worthless, but planning is everything.', 'Dwight D. Eisenhower, pidato 1957'),
    // 6 · Ahd 15 Nov
    H('مَن سلك طريقًا يلتمسُ فيه علمًا، سهَّل الله له به طريقًا إلى الجنة', 'Siapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga.', 'HR. Muslim 2699'),
    G('Tak ada hal besar yang tercipta tiba-tiba, sebagaimana setandan anggur atau buah tin. Biarkan ia berbunga dulu, lalu berbuah, lalu matang.', 'No great thing is created suddenly, any more than a bunch of grapes or a fig.', 'Epiktetos, Discourses 1.15'),
    // 7 · Sen 16 Nov
    U('لا يُستطاعُ العلمُ براحةِ الجسم', 'Ilmu tidak bisa diraih dengan badan yang terus bersantai.', 'Yahya bin Abi Katsir · diriwayatkan Muslim dalam Shahih-nya (no. 612)'),
    G('Mencoba memecahkan soal sebelum diajari caranya membuat belajar lebih baik, bahkan ketika percobaan itu salah.', 'Trying to solve a problem before being taught the solution leads to better learning, even when errors are made in the attempt.', 'Brown, Roediger & McDaniel, Make It Stick (2014)'),
    // 8 · Sel 17 Nov
    H('اللهمَّ بارِكْ لأمَّتي في بُكورِها', 'Ya Allah, berkahilah umatku pada waktu paginya.', 'HR. Abu Dawud 2606, at-Tirmidzi 1212 · dishahihkan al-Albani'),
    U('نفسُك إن لم تشغَلْها بالحقِّ شغَلَتْك بالباطل', 'Jiwamu, jika tidak kau sibukkan dengan kebenaran, ia akan menyibukkanmu dengan kebatilan.', 'Dinukil Imam asy-Syafi\'i · Ibnu al-Qayyim, al-Jawab al-Kafi'),
    // 9 · Rab 18 Nov
    Q('وأنْ ليس للإنسان إلا ما سعى • وأنَّ سعيَه سوف يُرى', 'Manusia tidak memperoleh selain apa yang ia usahakan, dan usahanya itu kelak akan diperlihatkan.', 'QS. An-Najm [53]: 39–40'),
    G('Kamu tidak naik setinggi targetmu. Kamu turun ke level sistemmu.', 'You do not rise to the level of your goals. You fall to the level of your systems.', 'James Clear, Atomic Habits (2018)'),
    // 10 · Kam 19 Nov · batas bahts
    G('Yang sempurna adalah musuh dari yang baik.', 'Le mieux est l\'ennemi du bien.', 'Voltaire, La Bégueule (1772)'),
    H('إنَّ الله كتَب الإحسانَ على كلِّ شيء', 'Sesungguhnya Allah mewajibkan ihsan, berbuat sebaik-baiknya, dalam segala hal.', 'HR. Muslim 1955'),
    // 11 · Jum 20 Nov
    U('أخي لن تنالَ العلمَ إلا بستَّةٍ • سأُنبيك عن تفصيلها ببيانِ • ذكاءٌ وحرصٌ واجتهادٌ وبُلغةٌ • وصحبةُ أستاذٍ وطولُ زمانِ', 'Saudaraku, ilmu tak akan diraih kecuali dengan enam hal: kecerdasan, semangat, kesungguhan, bekal, bimbingan guru, dan waktu yang panjang.', 'Imam asy-Syafi\'i, Diwan'),
    G('Istirahat bukanlah kemalasan.', 'Rest is not idleness.', 'John Lubbock, The Use of Life (1894)'),
    // 12 · Sab 21 Nov · simulasi 1
    G('Belajar menjadi lebih dalam dan lebih awet ketika ia menuntut usaha.', 'Learning is deeper and more durable when it\'s effortful.', 'Brown, Roediger & McDaniel, Make It Stick (2014)'),
    G('Yang menghalangi tindakan justru memajukan tindakan. Yang menghadang jalan menjadi jalan.', 'The impediment to action advances action. What stands in the way becomes the way.', 'Marcus Aurelius, Meditations 5.20'),
    // 13 · Ahd 22 Nov
    U('وأجودُ الأوقات للحفظ الأسحارُ، وللبحث الإبكارُ، وللكتابة وسطُ النهار، وللمطالعة والمذاكرة الليلُ', 'Waktu terbaik untuk menghafal adalah sahur, untuk mengkaji adalah pagi, untuk menulis adalah tengah hari, dan untuk menelaah serta mengulang adalah malam.', 'Ibnu Jama\'ah, Tadzkirah as-Sami\' wal-Mutakallim'),
    G('Ingatan adalah endapan dari apa yang kamu pikirkan.', 'Memory is the residue of thought.', 'Daniel T. Willingham, Why Don\'t Students Like School? (2009)'),
    // 14 · Sen 23 Nov
    Q('والذين جاهدوا فينا لَنهدينَّهم سُبُلَنا', 'Orang-orang yang bersungguh-sungguh di jalan Kami, pasti Kami tunjukkan kepada mereka jalan-jalan Kami.', 'QS. Al-Ankabut [29]: 69'),
    G('Apa yang tidak bisa kususun sendiri, belum benar-benar kupahami.', 'What I cannot create, I do not understand.', 'Richard Feynman, tulisan di papan tulisnya (1988)'),
    // 15 · Sel 24 Nov · simulasi 2
    Q('لا يُكلِّفُ الله نفسًا إلا وُسعَها', 'Allah tidak membebani seseorang melainkan sesuai kesanggupannya.', 'QS. Al-Baqarah [2]: 286'),
    U('تخلُّلُ الفتَرات للسالكين أمرٌ لازمٌ لا بدَّ منه، فمَن كانت فترتُه إلى مقاربةٍ وتسديدٍ… رُجِيَ له أن يعود خيرًا مما كان', 'Masa lesu pasti dialami setiap penempuh jalan. Siapa yang lesunya tetap dalam batas lurus dan mendekat, diharapkan ia kembali lebih baik dari sebelumnya.', 'Ibnu al-Qayyim, Madarij as-Salikin'),
    // 16 · Rab 25 Nov · hafalan Qur'an tuntas
    Q('ولقد يسَّرنا القرآنَ للذِّكر فهل من مُدَّكِر', 'Sungguh, telah Kami mudahkan Al-Qur\'an untuk peringatan. Adakah yang mau mengambil pelajaran?', 'QS. Al-Qamar [54]: 17'),
    H('تعاهَدوا هذا القرآن، فوالذي نفسُ محمدٍ بيده لهو أشدُّ تفلُّتًا من الإبل في عُقُلها', 'Jagalah Al-Qur\'an ini dengan terus mengulangnya. Demi Zat yang jiwa Muhammad di tangan-Nya, ia lebih cepat lepas daripada unta dari ikatannya.', 'HR. Muslim 791'),
    // 17 · Kam 26 Nov
    U('إضاعةُ الوقت أشدُّ من الموت؛ لأن إضاعة الوقت تقطعُك عن الله والدار الآخرة، والموتُ يقطعُك عن الدنيا وأهلها', 'Menyia-nyiakan waktu lebih berat daripada kematian. Menyia-nyiakan waktu memutusmu dari Allah dan akhirat, sedangkan kematian hanya memutusmu dari dunia dan penghuninya.', 'Ibnu al-Qayyim, al-Fawa\'id'),
    H('نِعمتان مغبونٌ فيهما كثيرٌ من الناس: الصحةُ والفراغ', 'Dua nikmat yang membuat banyak manusia merugi: kesehatan dan waktu luang.', 'HR. al-Bukhari 6412'),
    // 18 · Jum 27 Nov
    H('خُذوا من العمل ما تُطيقون، فإنَّ الله لا يَمَلُّ حتى تَمَلُّوا', 'Kerjakan amal sesuai kemampuan kalian, karena Allah tidak bosan memberi pahala sampai kalian sendiri yang bosan.', 'HR. al-Bukhari 1970'),
    G('Tidur adalah hal paling efektif yang bisa kita lakukan untuk memulihkan kesehatan otak dan tubuh setiap hari.', 'Sleep is the single most effective thing we can do to reset our brain and body health each day.', 'Matthew Walker, Why We Sleep (2017)'),
    // 19 · Sab 28 Nov · hari ringan
    Q('فإنَّ مع العُسر يُسرًا • إنَّ مع العُسر يُسرًا', 'Sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.', 'QS. Al-Insyirah [94]: 5–6'),
    U('شكوتُ إلى وكيعٍ سوءَ حفظي • فأرشدني إلى تركِ المعاصي • وأخبرني بأنَّ العلمَ نورٌ • ونورُ الله لا يُهدى لعاصي', 'Aku mengadu kepada Waki\' tentang buruknya hafalanku, lalu ia menasihatiku agar meninggalkan maksiat. Ia berkata: ilmu itu cahaya, dan cahaya Allah tidak diberikan kepada pelaku maksiat.', 'Imam asy-Syafi\'i, Diwan'),
    // 20 · Ahd 29 Nov · UJIAN Muamalat & Usroh
    H('اللهمَّ لا سهلَ إلا ما جعلتَه سهلًا، وأنت تجعلُ الحَزْنَ إذا شئتَ سهلًا', 'Ya Allah, tidak ada yang mudah kecuali yang Engkau jadikan mudah. Engkau menjadikan yang sulit, bila Engkau kehendaki, menjadi mudah.', 'HR. Ibnu Hibban 974 · dishahihkan Ibnu Hajar'),
    H('وإنْ أصابك شيءٌ فلا تقُلْ: لو أنِّي فعلتُ كان كذا وكذا، ولكن قُلْ: قدَرُ الله وما شاء فعل', 'Jika sesuatu menimpamu, jangan berkata: seandainya dulu aku begini, tentu hasilnya begitu. Katakanlah: ini takdir Allah, dan apa yang Dia kehendaki pasti Dia lakukan.', 'HR. Muslim 2664'),
    // 21 · Sen 30 Nov · hari Faraidh
    H('ألحِقوا الفرائضَ بأهلها، فما بقي فهو لأَوْلى رجلٍ ذكرٍ', 'Berikan bagian warisan kepada yang berhak menerimanya. Sisanya untuk kerabat laki-laki yang paling dekat.', 'HR. al-Bukhari 6732, Muslim 1615'),
    Q('تلك حدودُ الله، ومَن يُطِعِ اللهَ ورسولَه يُدخِلْه جناتٍ تجري من تحتها الأنهار', 'Itulah batas-batas hukum Allah. Siapa menaati Allah dan Rasul-Nya, Dia masukkan ke surga yang mengalir di bawahnya sungai-sungai.', 'QS. An-Nisa\' [4]: 13 · penutup ayat waris'),
    // 22 · Sel 1 Des · UJIAN Faraidh
    Q('وما توفيقي إلا بالله، عليه توكَّلتُ وإليه أُنيب', 'Tiada taufik bagiku melainkan dari Allah. Hanya kepada-Nya aku bertawakal dan kepada-Nya aku kembali.', 'QS. Hud [11]: 88'),
    H('الماهرُ بالقرآن مع السَّفَرة الكرام البرَرة، والذي يقرأ القرآن ويتَتَعْتَعُ فيه وهو عليه شاقٌّ له أجران', 'Yang mahir membaca Al-Qur\'an bersama para malaikat yang mulia. Yang membacanya terbata-bata dan merasa berat, baginya dua pahala.', 'HR. Muslim 798'),
    // 23 · Rab 2 Des · hari Qur'an
    H('يُقال لصاحب القرآن: اقرأْ وارتَقِ ورتِّلْ كما كنتَ ترتِّلُ في الدنيا، فإنَّ منزلَك عند آخرِ آيةٍ تقرؤها', 'Dikatakan kepada pemilik Al-Qur\'an: bacalah, naiklah, dan tartilkan sebagaimana dulu engkau membacanya di dunia. Kedudukanmu ada pada ayat terakhir yang engkau baca.', 'HR. Abu Dawud 1464, at-Tirmidzi 2914 · hasan shahih'),
    H('خيرُكم مَن تعلَّم القرآنَ وعلَّمه', 'Sebaik-baik kalian adalah yang mempelajari Al-Qur\'an dan mengajarkannya.', 'HR. al-Bukhari 5027'),
    // 24 · Kam 3 Des · UJIAN Qur'an
    Q('حسبُنا اللهُ ونِعمَ الوكيل', 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.', 'QS. Ali Imran [3]: 173'),
    Q('قُل هل يستوي الذين يعلمون والذين لا يعلمون', 'Katakanlah: apakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?', 'QS. Az-Zumar [39]: 9'),
    // 25 · Jum 4 Des
    H('إنما العلمُ بالتعلُّم', 'Ilmu itu hanya didapat dengan belajar.', 'Disebut al-Bukhari secara mu\'allaq (Kitab al-Ilm) · dihasankan Ibnu Hajar, Fath al-Bari'),
    H('إذا مرِض العبدُ أو سافر، كُتِب له مثلُ ما كان يعمل مقيمًا صحيحًا', 'Jika seorang hamba sakit atau bepergian, dicatat baginya pahala seperti amal yang biasa ia kerjakan saat sehat dan mukim.', 'HR. al-Bukhari 2996'),
    // 26 · Sab 5 Des
    U('لا يتعلَّمُ العلمَ مُستحْيٍ ولا مُستكبِرٌ', 'Ilmu tidak akan dipelajari oleh orang yang malu bertanya dan orang yang sombong.', 'Mujahid · disebut al-Bukhari dalam Shahih-nya (Kitab al-Ilm)'),
    Q('سيجعلُ الله بعد عُسرٍ يُسرًا', 'Allah kelak akan memberikan kelapangan setelah kesempitan.', 'QS. Ath-Thalaq [65]: 7'),
    // 27 · Ahd 6 Des · UJIAN Adilah
    H('اللهمَّ انفعني بما علَّمتني، وعلِّمني ما ينفعني، وزِدني علمًا', 'Ya Allah, berilah manfaat dengan apa yang Engkau ajarkan kepadaku, ajarkan kepadaku apa yang bermanfaat, dan tambahkanlah ilmu kepadaku.', 'HR. at-Tirmidzi 3599, Ibnu Majah 251 · dishahihkan al-Albani'),
    Q('إنَّ الله لا يُضيعُ أجرَ المحسنين', 'Sesungguhnya Allah tidak menyia-nyiakan pahala orang-orang yang berbuat baik.', 'QS. At-Taubah [9]: 120'),
    // 28 · Sen 7 Des
    U('تفقَّهوا قبل أن تُسوَّدوا', 'Dalamilah ilmu sebelum kalian diangkat menjadi pemimpin.', 'Umar bin al-Khaththab · disebut al-Bukhari dalam Shahih-nya (Kitab al-Ilm)'),
    G('Jangan pernah bolong dua kali berturut-turut.', 'Never miss twice.', 'James Clear, Atomic Habits (2018)'),
    // 29 · Sel 8 Des
    Q('يرفعِ اللهُ الذين آمنوا منكم والذين أُوتوا العلمَ درجات', 'Allah meninggikan orang-orang yang beriman di antara kalian dan orang-orang yang diberi ilmu beberapa derajat.', 'QS. Al-Mujadilah [58]: 11'),
    U('ابنَ آدم، إنما أنت أيامٌ، كلما ذهب يومٌ ذهب بعضُك', 'Wahai anak Adam, engkau hanyalah kumpulan hari. Setiap kali satu hari berlalu, hilanglah sebagian dirimu.', 'Al-Hasan al-Bashri · Abu Nu\'aim, Hilyat al-Auliya\' (2/148)'),
    // 30 · Rab 9 Des · UJIAN Nizhom
    H('احفظِ اللهَ يحفظْك… وإذا سألتَ فاسألِ الله، وإذا استعنتَ فاستعِنْ بالله', 'Jagalah perintah Allah, niscaya Dia menjagamu. Jika engkau meminta, mintalah kepada Allah. Jika engkau memohon pertolongan, mohonlah kepada Allah.', 'HR. at-Tirmidzi 2516 · hasan shahih'),
    Q('ولا تَهِنوا ولا تحزَنوا وأنتمُ الأعلَون إن كنتم مؤمنين', 'Janganlah kamu lemah dan jangan bersedih, padahal kamulah yang paling tinggi derajatnya jika kamu beriman.', 'QS. Ali Imran [3]: 139'),
    // 31 · Kam 10 Des · UJIAN terakhir
    H('عجَبًا لأمر المؤمن، إنَّ أمرَه كلَّه خير', 'Sungguh menakjubkan urusan seorang mukmin; seluruh urusannya adalah kebaikan.', 'HR. Muslim 2999'),
    Q('وآخِرُ دعواهم أنِ الحمدُ لله ربِّ العالمين', 'Dan penutup doa mereka: segala puji bagi Allah, Rabb semesta alam.', 'QS. Yunus [10]: 10'),
  ];

  const FAIDAH = [
    'Menguji diri tanpa buka buku menguatkan ingatan lebih dari membaca ulang. Ini disebut testing effect.',
    'Sesi yang terasa berat sering justru paling melekat. Kesulitan yang pas memperdalam pengolahan (desirable difficulty).',
    'Saat tidur, hippocampus memutar ulang materi hari ini lalu memindahkannya ke penyimpanan jangka panjang. Tidur 22:30 itu bagian dari belajar.',
    'Mengacak jenis soal (interleaving) melatih otak mengenali "ini kasus apa", persis yang diuji di Faraidh.',
    'Jelaskan dengan kata sendiri. Titik di mana kamu macet menjelaskan, itulah celah pemahamanmu (self-explanation).',
    'Isi jeda 5 menit dengan diam, jalan, atau minum, bukan scroll. Istirahat tanpa input membantu memori memadat.',
    'Jalan kaki sebentar menaikkan aliran darah ke otak. Fokus sesudahnya biasanya lebih tajam.',
    'Kekurangan cairan 1–2% saja sudah bisa menurunkan konsentrasi. Taruh botol air di meja.',
    'HP di luar jangkauan berarti lebih sedikit godaan "cek sebentar". Tiap cek memecah fokus dan butuh waktu untuk kembali.',
    'Rencana yang spesifik (jam berapa, di mana, buka apa) jauh lebih sering terlaksana daripada niat umum (implementation intention).',
    'Rasa enggan paling besar justru sebelum mulai. Janjikan dirimu 5 menit saja; biasanya sisanya mengalir.',
    'Mengulang dengan jarak 1, 3, lalu 7 hari jauh lebih awet daripada mengulang beruntun dalam satu malam (spacing effect).',
    'Cahaya pagi yang masuk ke mata menguatkan jam biologis, sehingga malamnya lebih mudah tidur tepat waktu.',
    'Rata-rata waktu paruh kafein sekitar 5 jam. Hindari kopi setelah Ashar supaya tidur 22:30 tetap nyenyak.',
    'Mencoba menjawab sebelum melihat jawaban membuat jawaban benar lebih melekat, bahkan ketika tebakanmu salah.',
    'Kesalahan yang kamu yakini benar, begitu dikoreksi, justru paling mudah diingat (hypercorrection effect). Jangan takut salah saat latihan.',
    'Belajar di lebih dari satu tempat membuat ingatan tidak terikat pada satu ruangan.',
    'Rasa "sudah paham" saat membaca ulang sering menipu (illusion of fluency). Uji dengan kertas kosong.',
    'Tutup tiap sesi dengan satu kalimat: "yang kupahami barusan adalah…". Itu latihan mengingat kecil yang efektif.',
    'Napas pelan dengan embusan lebih panjang dari tarikan membantu menenangkan tubuh sebelum ujian.',
    'Sebelum ujian, pilih makanan yang mengenyangkan lama (protein dan karbohidrat kompleks), hindari yang terlalu manis.',
    'Kalau buntu di satu soal ujian, lompati dulu. Kembali nanti dengan kepala yang lebih segar.',
    'Kemajuan kecil yang terlihat, seperti titik yang terisi, memicu dopamin dan dorongan untuk lanjut.',
    'Menulis ulang di kertas kosong memaksa otak menyusun, bukan sekadar mengenali. Itu inti latihan kartu Bidayah.',
  ];

  const EXAM_DUA = {
    ar: 'ربِّ اشرَحْ لي صدري • ويسِّرْ لي أمري • واحلُلْ عُقدةً من لساني • يفقَهوا قولي',
    id: 'Ya Rabbku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskan kekakuan dari lidahku agar mereka memahami perkataanku.',
    src: 'QS. Thaha [20]: 25–28',
  };

  window.DAWAM_QUOTES = { QUOTES, FAIDAH, EXAM_DUA };
})();
