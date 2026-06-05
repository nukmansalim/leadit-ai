import React from "react";
import Link from "next/link";
import { MarketingHeader } from "./_components/marketing-header";
import { HeroSection } from "./_components/hero-section";
import { StatsSection } from "./_components/stats-section";
import { FeaturesSection } from "./_components/features-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { PricingSection } from "./_components/pricing-section";
import { MarketingFooter } from "./_components/marketing-footer";

const ArrowRight = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* Navbar / Header */}
      <MarketingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
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

      {/* Footer Section */}
      <MarketingFooter />
    </div>
  );
}
