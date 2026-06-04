"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    AuthShell,
    AuthCard,
    AuthInput,
    SubmitButton,
    AuthIllustration
} from "@/components";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const successParam = searchParams.get("success");
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
        <AuthShell
            illustration={<AuthIllustration type="login" />}
            badgeText="Enterprise Intelligence"
            badgeTheme="blue"
            title={<>Selamat Datang<br />Kembali</>}
            subtitle="Masuk ke akun LEADIT Intelligence Anda"
            footerLinkPrefix="Belum punya akun?"
            footerLinkText="Daftar sekarang"
            footerLinkHref="/register"
            mobileGradientClass="bg-gradient-to-r from-[#2563EB] via-[#0D9488] to-[#2563EB]"
        >
            <AuthCard>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {successParam && (
                        <div className="bg-[#f0fdf4] border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            {successParam}
                        </div>
                    )}

                    {error && (
                        <div data-testid="error-message" className="bg-[#FFF1F2] border border-[#F43F5E]/20 text-[#F43F5E] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

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
                        rightElement={
                            <Link href="#" className="text-xs text-[#2563EB] hover:text-[#1d4ed8] font-medium">
                                Lupa Password?
                            </Link>
                        }
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                    />

                    <SubmitButton
                        loading={loading}
                        text="Masuk"
                        loadingText="Masuk..."
                    />
                </form>
            </AuthCard>
        </AuthShell>
    );
}
