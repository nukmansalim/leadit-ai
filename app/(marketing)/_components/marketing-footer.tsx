import React from "react";

const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 13L8 8L13 13L21 5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 5H15M21 5V11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function MarketingFooter() {
  return (
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
  );
}
