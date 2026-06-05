import React from "react";
import { features } from "../_data/landing";

export function FeaturesSection() {
  return (
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
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={f.iconSvgPath} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
