import React from "react";

export interface Feature {
  title: string;
  desc: string;
  color: string;
  iconSvgPath: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

export const features: Feature[] = [
  {
    iconSvgPath: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
    title: "Lead Discovery",
    desc: "Temukan prospek bisnis potensial dari jutaan data menggunakan AI yang menganalisis industri, lokasi, dan sinyal beli.",
    color: "bg-[#2563EB]/10 text-[#2563EB]",
  },
  {
    iconSvgPath: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
    title: "Market Analytics",
    desc: "Dashboard analitik real-time yang menampilkan tren pasar, segmentasi, dan peluang pertumbuhan bisnis Anda.",
    color: "bg-[#0D9488]/10 text-[#0D9488]",
  },
  {
    iconSvgPath: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
    title: "AI Enrichment",
    desc: "Perkaya data lead secara otomatis dengan informasi kontak, profil perusahaan, revenue, dan scoring kualitas.",
    color: "bg-[#7c3aed]/10 text-[#7c3aed]",
  },
  {
    iconSvgPath: "M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z",
    title: "Smart Scoring",
    desc: "Sistem penilaian otomatis berbasis machine learning untuk memprioritaskan lead dengan potensi konversi tertinggi.",
    color: "bg-[#F43F5E]/10 text-[#F43F5E]",
  },
  {
    iconSvgPath: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 016.364 6.364l-4.5 4.5a4.5 4.5 0 01-7.244-1.242",
    title: "50+ Integrasi",
    desc: "Hubungkan dengan CRM, email marketing, dan platform penjualan favorit Anda secara seamless tanpa kode.",
    color: "bg-[#2563EB]/10 text-[#2563EB]",
  },
  {
    iconSvgPath: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    title: "Enterprise Security",
    desc: "Enkripsi end-to-end, SSO, dan compliance GDPR untuk menjaga keamanan data bisnis Anda di level enterprise.",
    color: "bg-[#0D9488]/10 text-[#0D9488]",
  },
];

export const stats: Stat[] = [
  { value: "500+", label: "Perusahaan" },
  { value: "2.5M+", label: "Lead Ditemukan" },
  { value: "98%", label: "Akurasi Data" },
  { value: "3x", label: "ROI Rata-rata" },
];

export const testimonials: Testimonial[] = [
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

export const pricingPlans: PricingPlan[] = [
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

export const howItWorksSteps = [
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
];
