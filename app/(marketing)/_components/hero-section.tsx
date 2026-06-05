import React from "react";
import Link from "next/link";

const ArrowRight = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#2563EB]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-[#0D9488]/8 rounded-full blur-3xl" />
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
  );
}
