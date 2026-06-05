import React from "react";
import Link from "next/link";
import { auth } from "@/auth";

const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 13L8 8L13 13L21 5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 5H15M21 5V11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export async function MarketingHeader() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
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
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:shadow-[#2563EB]/25"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors">
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:shadow-[#2563EB]/25"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
