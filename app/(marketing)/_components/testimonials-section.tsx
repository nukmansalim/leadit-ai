import React from "react";
import { testimonials } from "../_data/landing";

export function TestimonialsSection() {
  return (
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
  );
}
