"use client";

import React, { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import {
    AuthShell,
    AuthCard,
    AuthInput,
    SubmitButton,
    AuthIllustration
} from "@/components";

export default function RegisterForm() {
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
            const res = await registerAction({
                name,
                company_name: companyName,
                email,
                password
            });

            if (res && res.error) {
                setError(res.error);
            } else {
                setSuccess("Akun Berhasil Dibuat! Mengalihkan ke halaman login...");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal membuat akun.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            illustration={<AuthIllustration type="register" />}
            badgeText="Buat Akun Baru"
            badgeTheme="teal"
            title="Daftar Akun Baru"
            subtitle="Mulai perjalanan intelijen bisnis Anda"
            footerLinkPrefix="Sudah punya akun?"
            footerLinkText="Masuk"
            footerLinkHref="/login"
            mobileGradientClass="bg-gradient-to-r from-[#0D9488] via-[#2563EB] to-[#0D9488]"
        >
            <AuthCard>
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

                    <AuthInput
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

                    <AuthInput
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

                    <AuthInput
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

                    <AuthInput
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

                    <SubmitButton
                        loading={loading}
                        text="Daftar"
                        loadingText="Mendaftar..."
                    />
                </form>
            </AuthCard>
        </AuthShell>
    );
}
