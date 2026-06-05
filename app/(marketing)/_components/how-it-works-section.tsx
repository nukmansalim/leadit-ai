import React from "react";
import { howItWorksSteps } from "../_data/landing";

export function HowItWorksSection() {
  return (
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
          {howItWorksSteps.map((item, i) => (
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
  );
}
