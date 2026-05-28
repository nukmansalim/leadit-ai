🤖 AI Sales Intelligence Agent - Project Overview
📝 Deskripsi Proyek
Sistem otomatisasi pencarian prospek (lead generation) yang mengintegrasikan Google Places API untuk pencarian entitas bisnis dan Gemini AI untuk analisis kelayakan bisnis secara otomatis berdasarkan solution focus tertentu.

🏗️ Tech Stack
Framework: Next.js 15 (App Router)

Runtime: Node.js v25.9.0

Language: TypeScript

Database: PostgreSQL dengan Prisma ORM 7.8.0

Driver Adapter: @prisma/adapter-pg (Disesuaikan untuk stabilitas pada CachyOS/Arch Linux)

Task Queue: BullMQ + Redis (Untuk pemrosesan background worker)

AI Engine: Google Generative AI (Gemini 2.0 Flash)

🚀 Progres Saat Ini
1. Inisialisasi Arsitektur & Database
[x] Setup skema Prisma untuk User, SearchJob, dan Lead.

[x] Migrasi database ke PostgreSQL.

[x] Konfigurasi Prisma Driver Adapter untuk mengatasi isu binary engine pada sistem Linux Arch-based.

[x] Implementasi relasi composite unique key @@unique([userId, place_id]) pada model Lead untuk mencegah duplikasi data.

2. Core Service (Backend Logic)
[x] Google Places Service: Integrasi pencarian teks dan pengambilan detail tempat secara mendalam.

[x] LLM Service: Integrasi Gemini AI dengan prompt khusus untuk penilaian prospek (High/Medium/Low).

[x] Data Minimization: Optimasi pengiriman data ke AI (hanya mengirim properti esensial) untuk menghemat token dan mencegah rate limit.

3. Background Processing (Worker)
[x] Setup BullMQ Producer untuk memasukkan tugas ke antrean.

[x] Setup BullMQ Consumer (Worker) yang berjalan secara mandiri dari server utama.

[x] Implementasi logika Upsert agar testing berulang pada lokasi yang sama tidak menyebabkan crash database.

[x] Penanganan asinkronitas pada Next.js 15 API routes (params as a Promise).

4. API Endpoints
[x] POST /api/search: Memicu proses pencarian baru.

[x] GET /api/search/[jobId]: Polling status progres dan mengambil hasil ekstraksi prospek.

⚠️ Kendala & Solusi Teknis
Prisma 7 Engine Issue: Prisma 7 mewajibkan driver adapter secara eksplisit. Solusi: Menggunakan @prisma/adapter-pg dan inisialisasi manual di lib/prisma.ts.

Gemini Rate Limit (429): Akun Free Tier dibatasi 5-15 RPM. Solusi: Merampingkan data yang dikirim dan menggunakan model Gemini 2.0 Flash untuk kuota yang lebih longgar.

Async Params: Perubahan standar pada Next.js 15. Solusi: Melakukan await pada params di setiap dynamic route API.

🛠️ Langkah Selanjutnya (Next Steps)
[ ] Throttling/Sleep Logic: Menambahkan jeda waktu dinamis pada worker jika terdeteksi error 429 dari Google.

[ ] Frontend Dashboard: Membuat UI untuk menampilkan tabel Leads dengan filter skor AI.

[ ] Export Feature: Menambahkan fungsi unduh data prospek ke format CSV atau WhatsApp direct link.