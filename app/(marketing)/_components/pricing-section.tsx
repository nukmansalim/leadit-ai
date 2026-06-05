import React from "react";
import Link from "next/link";
import { pricingPlans } from "../_data/landing";

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PricingSection() {
  return (
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
  );
}
