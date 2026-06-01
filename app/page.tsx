import Link from "next/link";

/* ── tiny reusable icon components ── */
const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 13L8 8L13 13L21 5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 5H15M21 5V11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── feature data ── */
const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Lead Discovery",
    desc: "Temukan prospek bisnis potensial dari jutaan data menggunakan AI yang menganalisis industri, lokasi, dan sinyal beli.",
    color: "bg-[#2563EB]/10 text-[#2563EB]",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Market Analytics",
    desc: "Dashboard analitik real-time yang menampilkan tren pasar, segmentasi, dan peluang pertumbuhan bisnis Anda.",
    color: "bg-[#0D9488]/10 text-[#0D9488]",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI Enrichment",
    desc: "Perkaya data lead secara otomatis dengan informasi kontak, profil perusahaan, revenue, dan scoring kualitas.",
    color: "bg-[#7c3aed]/10 text-[#7c3aed]",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Smart Scoring",
    desc: "Sistem penilaian otomatis berbasis machine learning untuk memprioritaskan lead dengan potensi konversi tertinggi.",
    color: "bg-[#F43F5E]/10 text-[#F43F5E]",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 016.364 6.364l-4.5 4.5a4.5 4.5 0 01-7.244-1.242" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "50+ Integrasi",
    desc: "Hubungkan dengan CRM, email marketing, dan platform penjualan favorit Anda secara seamless tanpa kode.",
    color: "bg-[#2563EB]/10 text-[#2563EB]",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Enterprise Security",
    desc: "Enkripsi end-to-end, SSO, dan compliance GDPR untuk menjaga keamanan data bisnis Anda di level enterprise.",
    color: "bg-[#0D9488]/10 text-[#0D9488]",
  },
];

const stats = [
  { value: "500+", label: "Perusahaan" },
  { value: "2.5M+", label: "Lead Ditemukan" },
  { value: "98%", label: "Akurasi Data" },
  { value: "3x", label: "ROI Rata-rata" },
];

const testimonials = [
  {
    quote: "Leadit mengubah cara tim sales kami bekerja. Lead yang sebelumnya butuh 3 hari untuk ditemukan, sekarang bisa dapat dalam hitungan menit.",
    name: "Sarah Kusuma",
    role: "VP of Sales, TechCorp Indonesia",
    initials: "SK",
  },
  {
    quote: "Kualitas data yang luar biasa. AI scoring-nya sangat akurat dan membantu kami fokus pada prospek yang benar-benar berpotensi.",
    name: "Reza Pratama",
    role: "Head of Growth, Solusi Digital",
    initials: "RP",
  },
  {
    quote: "ROI kami naik 3x dalam 6 bulan pertama. Integrasi dengan CRM existing juga sangat smooth tanpa perlu developer.",
    name: "Diana Wijaya",
    role: "CEO, MarketReach",
    initials: "DW",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Gratis",
    desc: "Untuk tim kecil yang baru memulai",
    features: ["100 lead/bulan", "Basic AI scoring", "1 user", "Email support"],
    cta: "Mulai Gratis",
    highlight: false,
  },
  {
    name: "Professional",
    price: "Rp 1.5jt",
    period: "/bulan",
    desc: "Untuk tim sales yang serius",
    features: ["5.000 lead/bulan", "Advanced AI enrichment", "10 users", "Priority support", "CRM integration", "Custom reports"],
    cta: "Coba 14 Hari Gratis",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Untuk perusahaan besar",
    features: ["Unlimited leads", "Full AI suite", "Unlimited users", "Dedicated CSM", "SSO & SAML", "SLA 99.9%", "On-premise option"],
    cta: "Hubungi Sales",
    highlight: false,
  },
];

/* ── page ── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* ============ NAVBAR ============ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <ChartIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Leadit</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Fitur</a>
            <a href="#testimonials" className="hover:text-[#2563EB] transition-colors">Testimoni</a>
            <a href="#pricing" className="hover:text-[#2563EB] transition-colors">Harga</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors">
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:shadow-[#2563EB]/25"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#2563EB]/8 rounded-full blur-3xl animate-gradient-shift" />
          <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-[#0D9488]/8 rounded-full blur-3xl animate-gradient-shift-delayed" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 text-xs font-bold tracking-wider uppercase mb-8 text-[#2563EB]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
              AI-Powered Sales Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Temukan Lead Terbaik{" "}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent">
                Dengan Kecerdasan Buatan
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed max-w-2xl mx-auto mb-10">
              Leadit membantu tim sales menemukan, menganalisis, dan memprioritaskan prospek bisnis berkualitas tinggi — lebih cepat, lebih akurat, lebih efisien.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#2563EB]/30 active:scale-[0.98] text-base"
              >
                Mulai Gratis Sekarang
                <ArrowRight />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#e2e8f0] hover:border-[#cbd5e1] text-[#0F172A] font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white text-base"
              >
                Lihat Fitur
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Social proof mini */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[#64748B]">
              <div className="flex -space-x-2">
                {["SK", "RP", "DW", "AK"].map((i, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0D9488] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                    {i}
                  </div>
                ))}
              </div>
              <span>Dipercaya <strong className="text-[#0F172A]">500+ perusahaan</strong> di Indonesia</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-y border-[#e2e8f0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-[#64748B] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0D9488]/20 bg-[#0D9488]/5 text-[10px] font-bold tracking-widest uppercase text-[#0D9488] mb-4">
              Fitur Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Semua Yang Tim Sales Anda Butuhkan
            </h2>
            <p className="text-[#64748B] text-lg">
              Platform lengkap untuk menemukan, memperkaya, dan mengelola prospek bisnis menggunakan AI terdepan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white border border-[#e2e8f0] rounded-2xl p-7 hover:shadow-lg hover:shadow-[#2563EB]/5 hover:border-[#2563EB]/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-24 lg:py-32 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 text-[10px] font-bold tracking-widest uppercase text-[#2563EB] mb-4">
              Cara Kerja
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Tiga Langkah Menuju Lead Berkualitas
            </h2>
            <p className="text-[#64748B] text-lg">
              Mulai dari pencarian hingga closing, Leadit menyederhanakan seluruh proses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Cari & Temukan",
                desc: "Masukkan kriteria target Anda — industri, lokasi, ukuran perusahaan. AI kami akan memindai jutaan data bisnis.",
                gradient: "from-[#2563EB] to-[#3b82f6]",
              },
              {
                step: "02",
                title: "Analisis & Perkaya",
                desc: "Setiap lead otomatis diperkaya dengan data kontak, profil perusahaan, dan skor kualitas berbasis AI.",
                gradient: "from-[#0D9488] to-[#14b8a6]",
              },
              {
                step: "03",
                title: "Prioritaskan & Closing",
                desc: "Smart scoring membantu Anda fokus pada prospek berpotensi tinggi. Ekspor ke CRM dan mulai closing.",
                gradient: "from-[#7c3aed] to-[#a78bfa]",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center lg:text-left">
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} items-center justify-center text-white text-xl font-extrabold mb-5 shadow-lg`}>
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-[#e2e8f0]" />
                )}
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F43F5E]/20 bg-[#F43F5E]/5 text-[10px] font-bold tracking-widest uppercase text-[#F43F5E] mb-4">
              Testimoni
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Dipercaya Tim Sales Terbaik
            </h2>
            <p className="text-[#64748B] text-lg">
              Lihat bagaimana Leadit membantu perusahaan meningkatkan performa penjualan mereka.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-7 hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <svg key={s} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[#0F172A] leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0D9488] flex items-center justify-center text-white text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-[#64748B]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-24 lg:py-32 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 text-[10px] font-bold tracking-widest uppercase text-[#2563EB] mb-4">
              Harga
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Pilih Paket Yang Tepat
            </h2>
            <p className="text-[#64748B] text-lg">
              Mulai gratis, upgrade saat bisnis Anda berkembang.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-gradient-to-b from-[#2563EB] to-[#1e40af] text-white border-2 border-[#2563EB] shadow-xl shadow-[#2563EB]/20 scale-[1.02] relative"
                    : "bg-white border border-[#e2e8f0]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0D9488] text-white text-xs font-bold tracking-wider uppercase">
                    Populer
                  </div>
                )}

                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? "" : "text-[#0F172A]"}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.highlight ? "text-white/70" : "text-[#64748B]"}`}>{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className={`text-sm ${plan.highlight ? "text-white/60" : "text-[#64748B]"}`}>{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-white/20" : "bg-[#0D9488]/10"}`}>
                        <CheckIcon className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-[#0D9488]"}`} />
                      </div>
                      <span className={plan.highlight ? "text-white/90" : "text-[#64748B]"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`w-full py-3.5 rounded-xl font-bold text-center transition-all duration-200 block ${
                    plan.highlight
                      ? "bg-white text-[#2563EB] hover:bg-[#F8FAFC] shadow-lg"
                      : "bg-[#F8FAFC] text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#2563EB]/6 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#0D9488]/6 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Siap Meningkatkan{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent">
              Performa Sales
            </span>{" "}
            Anda?
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10">
            Bergabung dengan 500+ perusahaan yang telah menggunakan Leadit untuk menemukan lead berkualitas dan meningkatkan konversi penjualan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#2563EB]/30 active:scale-[0.98] text-lg"
            >
              Daftar Gratis Sekarang
              <ArrowRight />
            </Link>
          </div>
          <p className="mt-5 text-sm text-[#64748B]">
            Tidak perlu kartu kredit · Setup dalam 2 menit · Cancel kapan saja
          </p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center">
                  <ChartIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight uppercase">Leadit</span>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                AI-powered sales intelligence platform untuk menemukan dan mengelola lead berkualitas.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#94a3b8] mb-4">Produk</h4>
              <ul className="space-y-2.5 text-sm">
                {["Lead Discovery", "AI Enrichment", "Smart Scoring", "Integrations", "API"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#cbd5e1] hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#94a3b8] mb-4">Perusahaan</h4>
              <ul className="space-y-2.5 text-sm">
                {["Tentang Kami", "Karir", "Blog", "Kontak"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#cbd5e1] hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#94a3b8] mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                {["Privacy Policy", "Terms of Service", "Security", "GDPR"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#cbd5e1] hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#64748B]">© 2024 Leadit Intelligence. All rights reserved.</p>
            <div className="flex gap-5">
              {/* Social icons */}
              {[
                "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 110 4 2 2 0 010-4z",
              ].map((d, i) => (
                <a key={i} href="#" className="text-[#64748B] hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
