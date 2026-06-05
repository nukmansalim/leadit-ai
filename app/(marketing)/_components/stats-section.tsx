import React from "react";
import { stats } from "../_data/landing";

export function StatsSection() {
  return (
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
  );
}
