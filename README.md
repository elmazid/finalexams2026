# DAWAM · Persiapan UAS

Aplikasi web (PWA) untuk jadwal belajar 9 November – 10 Desember 2026: hitung mundur ujian, rekomendasi matkul per blok jam kosong, checklist harian, timeline, dan capaian. Semua progres tersimpan di HP, bukan di GitHub.

## Pasang di GitHub Pages (± 5 menit)

1. Ekstrak `dawam.zip`. Isinya 12 file dalam satu folder, tanpa subfolder.
2. Di github.com: **New repository** → nama misalnya `dawam` → **Public** → Create.
3. Di repo itu: **Add file → Upload files** → pilih semua 12 file → **Commit changes**.
   Dari iPhone: buka github.com di Safari (mode desktop jika tombol upload tidak muncul), lalu pilih file dari app Files.
4. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → **Save**.
5. Tunggu 1–2 menit, lalu buka `https://USERNAME.github.io/dawam/`.
6. Di Safari iPhone: tombol **Share → Add to Home Screen**. Selalu buka dari ikon itu; penyimpanannya terpisah dari tab Safari biasa.

## Memperbarui

- Ubah jadwal atau target di `data.js` (bagian `WEEK` dan `DAYS`), kutipan di `quotes.js`.
- Setelah mengunggah file baru, naikkan `VERSION` di `sw.js` (misal `dawam-v2`) supaya HP mengambil versi terbaru. Buka aplikasi dua kali agar pembaruan masuk.

## Cadangan data

Tab **Capaian → Cadangkan / pulihkan**: salin teks JSON ke Notes, atau bagikan sebagai file. Untuk memulihkan, tempel teksnya lalu ketuk **Pulihkan**.

## Isi folder

| File | Fungsi |
| --- | --- |
| `index.html` | Kerangka halaman |
| `styles.css` | Tampilan |
| `data.js` | Jadwal pekanan, rencana per tanggal, jadwal UAS, level |
| `quotes.js` | 64 bekal harian + faidah kejutan |
| `app.js` | Logika rekomendasi, checklist, XP, rantai, lencana |
| `sw.js` | Mode offline |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Ikon dan data instalasi |
