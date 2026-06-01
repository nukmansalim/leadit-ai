Berikut adalah draf Product Requirements Document (PRD) yang bisa Anda gunakan dan simpan sebagai `CLAUDE.md`. Dokumen ini dirancang untuk memandu proses *redesign* antarmuka Login dan Register agar tampil lebih segar, penuh warna, namun tetap mempertahankan kesan profesional.

---

# CLAUDE.md: PRD - Redesign Halaman Login & Register

## 1. Ringkasan Eksekutif

Pembaruan desain (redesign) pada halaman Login dan Register bertujuan untuk mengganti skema warna lama yang kurang memuaskan dengan palet warna baru yang lebih **hidup (colorful) namun tetap profesional**. Desain baru ini diharapkan dapat meningkatkan *user experience* (UX), memberikan kesan pertama yang positif, dan mempertahankan tingkat kepercayaan pengguna.

## 2. Objektif & Metrik Kesuksesan

* **Objektif:** Menyajikan antarmuka autentikasi yang modern, ramah pengguna, dan secara visual menarik tanpa mengorbankan fungsionalitas dan aksesibilitas.
* **Metrik Kesuksesan:**
* Penurunan *bounce rate* pada halaman autentikasi.
* Peningkatan kecepatan waktu pengisian *form* (karena hierarki visual yang lebih jelas).
* Konsistensi implementasi desain baru pada *mockup* Figma ke dalam kode HTML/CSS (*pixel-perfect*).



## 3. Panduan Warna Baru (Colorful yet Professional)

Konsep warna ini menggunakan perpaduan biru sebagai warna dasar profesionalisme, dengan aksen warna-warna cerah yang terkontrol untuk memberikan kesan dinamis dan modern.

### Palet Warna Utama

| Peran | Hex Code | Pratinjau Deskriptif | Penggunaan Utama |
| --- | --- | --- | --- |
| **Primary (Trust Blue)** | `#2563EB` | Biru Royal Cerah | Tombol utama (Login/Register), *link* aktif, *brand logo*. |
| **Accent 1 (Vibrant Teal)** | `#0D9488` | Hijau Kebiruan | Elemen sukses, *checkbox* aktif, *tooltip*, aksen dekoratif. |
| **Accent 2 (Warm Coral)** | `#F43F5E` | Merah Muda/Coral | Pesan *error*, peringatan, ikon notifikasi. |
| **Background (Soft Pearl)** | `#F8FAFC` | Abu-abu Sangat Terang | Warna latar belakang utama halaman luar *card* form. |
| **Surface (Clean White)** | `#FFFFFF` | Putih Bersih | Latar belakang *card* form, *input field*. |
| **Text Primary (Slate)** | `#0F172A` | Abu-abu Gelap (Hampir Hitam) | *Heading*, teks utama, label form. |
| **Text Secondary** | `#64748B` | Abu-abu Medium | Teks *placeholder*, deskripsi bantuan, *footer*. |

### Prinsip Penggunaan Warna

* **Aturan 60-30-10:** Gunakan `Soft Pearl` dan `Clean White` sebagai latar (60%), `Trust Blue` untuk elemen struktural dan identitas (30%), serta `Vibrant Teal` atau `Warm Coral` sebagai aksen untuk menarik perhatian (10%).
* **Kontras Aksesibilitas:** Pastikan rasio kontras antara teks dan latar belakang memenuhi standar WCAG (minimal 4.5:1 untuk teks normal).

## 4. Persyaratan Desain & UI/UX

* **Layout Card Berpusat:** Form Login/Register ditempatkan dalam *card* putih dengan *subtle drop shadow* di tengah layar, memberikan fokus penuh pada pengisian data.
* **Split Layout (Opsional untuk Desktop):** Bagian kiri/kanan berisi form autentikasi, sementara sisi lainnya menampilkan ilustrasi isometrik 3D yang relevan atau *gradient mesh* yang menggabungkan palet *Primary* dan *Accent*.
* **Interaksi Form (State):**
* **Default:** *Border* tipis berwarna `Text Secondary` dengan opasitas rendah.
* **Hover/Focus:** *Border* berubah menjadi `Trust Blue` dengan efek *glow* tipis (misalnya `box-shadow` CSS).
* **Error:** *Border* dan teks peringatan menggunakan `Warm Coral`.



## 5. Panduan Implementasi Teknis

Untuk mempermudah pengembangan dan menjaga konsistensi, segera definisikan palet warna di atas ke dalam variabel CSS sebelum memulai tahap *slicing*.

**Contoh Setup Variabel CSS:**

```css
:root {
  --color-primary: #2563EB;
  --color-accent-teal: #0D9488;
  --color-accent-coral: #F43F5E;
  --color-bg-base: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text-main: #0F172A;
  --color-text-muted: #64748B;
}

```

## 6. Langkah Selanjutya

1. Terapkan palet warna ini ke *Color Style* di sistem desain Anda.
2. Buat *draft* UI di atas kanvas desain dan pastikan *spacing* serta *typography* selaras dengan elemen warna.
3. Lakukan tinjauan awal pada *prototype* interaktif (khususnya transisi perpindahan dari halaman Login ke Register).
