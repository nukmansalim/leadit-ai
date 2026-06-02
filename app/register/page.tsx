"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    company_name: companyName,
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Gagal membuat akun.");
            }

            setSuccess("Akun Berhasil Dibuat! Mengalihkan ke halaman login...");
            
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col lg:flex-row overflow-hidden relative">

            {/* Left Side - Decorative Gradient Panel (Desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-[#0f766e] to-[#2563EB] items-center justify-center p-12">
                {/* Animated gradient mesh blobs */}
                <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-[#2563EB]/30 rounded-full blur-3xl animate-gradient-shift"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] bg-[#0D9488]/30 rounded-full blur-3xl animate-gradient-shift-delayed"></div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl"></div>

                {/* Content over gradient */}
                <div className="relative z-10 text-white max-w-md">
                    {/* Isometric-style illustration */}
                    <div className="mb-10 flex justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center animate-float">
                                <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#2563EB]/40 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center animate-float-delayed">
                                <svg className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="absolute -top-3 -left-3 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-center animate-float">
                                <svg className="w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                        Mulai Perjalanan Bisnis Anda
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Bergabung bersama ribuan profesional yang telah menggunakan AI untuk meningkatkan penjualan mereka.
                    </p>

                    {/* Feature highlights */}
                    <div className="mt-8 space-y-3">
                        {[
                            "Analisis lead otomatis dengan AI",
                            "Integrasi dengan 50+ platform",
                            "Laporan intelijen real-time"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-white/70 text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
                {/* Mobile gradient strip */}
                <div className="lg:hidden absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D9488] via-[#2563EB] to-[#0D9488]"></div>

                {/* Header */}
                <header className="w-full max-w-md flex items-center justify-between mb-10">
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0D9488]/20 bg-[#0D9488]/5 text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-[#0D9488]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse"></div>
                        Buat Akun Baru
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-2 leading-tight text-[#0F172A]">
                        Daftar Akun Baru
                    </h1>
                    <p className="text-[#64748B] text-center mb-8">
                        Mulai perjalanan intelijen bisnis Anda
                    </p>

                    {/* Register Card */}
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
                            
                            {success && (
                                <div className="bg-[#f0fdf4] border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    {success}
                                </div>
                            )}

                            <InputField
                                label="Nama Lengkap"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />

                            <InputField
                                label="Nama Perusahaan"
                                id="companyName"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="PT Contoh Teknologi"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                }
                            />

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
                                {loading ? "Mendaftar..." : "Daftar"}
                                {!loading && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-10 text-[#64748B]">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-[#2563EB] font-bold hover:text-[#1d4ed8] underline underline-offset-4 decoration-[#2563EB]/40 hover:decoration-[#2563EB]">
                            Masuk
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
