"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import type { Metadata } from "next";

interface InputFieldProps {
    label: string;
    type: string;
    placeholder: string;
    id: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    hasError?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, id, icon, rightElement, value, onChange, required, hasError }) => (
    <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
            <label htmlFor={id} className="text-sm font-semibold text-[#0F172A]">
                {label}
            </label>
            {rightElement}
        </div>
        <div className="relative group">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors">
                    {icon}
                </div>
            )}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`w-full bg-white border ${hasError ? 'border-[#F43F5E] ring-2 ring-[#F43F5E]/20' : 'border-[#e2e8f0]'} rounded-xl py-3.5 ${icon ? 'pl-11' : 'px-4'} pr-4 text-[#0F172A] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200`}
            />
        </div>
    </div>
);

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            window.location.href = "/";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col lg:flex-row overflow-hidden relative">

            {/* Left Side - Decorative Gradient Panel (Desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1e40af] to-[#0D9488] items-center justify-center p-12">
                {/* Animated gradient mesh blobs */}
                <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-[#0D9488]/30 rounded-full blur-3xl animate-gradient-shift"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#3b82f6]/30 rounded-full blur-3xl animate-gradient-shift-delayed"></div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl"></div>

                {/* Content over gradient */}
                <div className="relative z-10 text-white max-w-md">
                    {/* Isometric-style illustration placeholder */}
                    <div className="mb-10 flex justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center animate-float">
                                <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 13L8 8L13 13L21 5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 5H15M21 5V11" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#0D9488]/40 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center animate-float-delayed">
                                <svg className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                        AI-Powered Sales Intelligence
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Temukan lead berkualitas tinggi, analisis pasar, dan tingkatkan konversi penjualan Anda dengan kecerdasan buatan.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[0,1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold">
                                    {['A','B','C','D'][i]}
                                </div>
                            ))}
                        </div>
                        <p className="text-white/60 text-sm">Dipercaya 500+ perusahaan</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
                {/* Mobile gradient strip */}
                <div className="lg:hidden absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2563EB] via-[#0D9488] to-[#2563EB]"></div>

                {/* Header */}
                <header className="w-full max-w-md flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M3 13L8 8L13 13L21 5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 5H15M21 5V11" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#0F172A] uppercase">Leadit</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="w-full max-w-md flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-[#2563EB]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse"></div>
                        Enterprise Intelligence
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-2 leading-tight text-[#0F172A]">
                        Selamat Datang<br />Kembali
                    </h1>
                    <p className="text-[#64748B] text-center mb-10">
                        Masuk ke akun LEADIT Intelligence Anda
                    </p>

                    {/* Login Card */}
                    <div className="w-full bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.04)] flex flex-col gap-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {error && (
                                <div className="bg-[#FFF1F2] border border-[#F43F5E]/20 text-[#F43F5E] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <InputField
                                label="Email"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                hasError={!!error}
                                placeholder="nama@perusahaan.com"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                            />

                            <InputField
                                label="Password"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                hasError={!!error}
                                placeholder="••••••••"
                                rightElement={<Link href="#" className="text-xs text-[#2563EB] hover:text-[#1d4ed8] font-medium">Lupa Password?</Link>}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#2563EB]/30 active:scale-[0.98] mt-1"
                            >
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : null}
                                {loading ? "Masuk..." : "Masuk"}
                                {!loading && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>


                        </form>
                    </div>

                    <p className="mt-10 text-[#64748B]">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-[#2563EB] font-bold hover:text-[#1d4ed8] underline underline-offset-4 decoration-[#2563EB]/40 hover:decoration-[#2563EB]">
                            Daftar sekarang
                        </Link>
                    </p>
                </main>

                {/* Footer */}
                <footer className="mt-auto w-full max-w-md pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto text-center md:text-left">
                        <div className="text-[10px] font-black tracking-widest text-[#0F172A]">LEADIT INTEL</div>
                        <div className="hidden md:block h-3 w-[1px] bg-[#e2e8f0]"></div>
                        <div className="text-[10px] text-[#64748B]">
                            © 2024 Leadit Intelligence. All rights reserved.
                        </div>
                    </div>
                    <div className="flex gap-6 text-[10px] text-[#64748B] font-medium">
                        <Link href="#" className="hover:text-[#2563EB]">Privacy</Link>
                        <Link href="#" className="hover:text-[#2563EB]">Terms</Link>
                        <Link href="#" className="hover:text-[#2563EB]">Security</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
