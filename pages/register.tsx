import React, { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

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
}

const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, id, icon, rightElement, value, onChange, required }) => (
    <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
            <label htmlFor={id} className="text-sm font-medium text-gray-300">
                {label}
            </label>
            {rightElement}
        </div>
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                className={`w-full bg-[#1c1b1b] border border-[#3a3939] rounded-lg py-3 ${icon ? 'pl-10' : 'px-4'} pr-10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d9d2c5]/50 transition-all`}
            />
        </div>
    </div>
);

export default function Register() {
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
            
            // Redirect to login page after a short delay
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
        <>
            <Head>
                <title>Obsidian Intelligence - Daftar</title>
            </Head>
            <div className="min-h-screen bg-[#131313] text-[#d9d2c5] font-sans flex flex-col items-center px-6 py-12 overflow-hidden relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d9d2c5]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#412d15]/20 rounded-full blur-3xl"></div>
                </div>

                {/* Header */}
                <header className="w-full max-w-7xl flex items-center justify-between mb-12 px-4 md:px-8 z-10">
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 13L8 8L13 13L21 5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 5H15M21 5V11" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xl font-bold tracking-tight uppercase">Leadit</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="w-full max-w-md flex flex-col items-center z-10">
                    <div className="inline-block px-4 py-1 rounded-full border border-[#d9d2c5]/20 bg-[#d9d2c5]/5 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                        Enterprise Intelligence
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-2 leading-tight">
                        Daftar Akun Baru
                    </h1>
                    <p className="text-gray-400 text-center mb-10">
                        Mulai perjalanan intelijen bisnis Anda
                    </p>

                    {/* Register Card */}
                    <div className="w-full bg-[#1c1b1b]/80 backdrop-blur-md border border-[#3a3939] rounded-2xl p-8 flex flex-col gap-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {error && (
                                <div className="bg-[#93000a] text-[#ffb4ab] px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            {success && (
                                <div className="bg-[#1e4620] text-[#a3e5a5] px-4 py-3 rounded-lg text-sm">
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
                                placeholder="nama@perusahaan.com"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                                className="w-full bg-[#d9d2c5] text-[#131313] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-70 mt-2"
                            >
                                {loading ? "Mendaftar..." : "Daftar"}
                                {!loading && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-10 text-gray-400">
                        Sudah punya akun? <Link href="/login" className="text-white font-bold underline underline-offset-4 decoration-[#d9d2c5]">Masuk</Link>
                    </p>
                </main>

                {/* Footer */}
                <footer className="mt-auto w-full max-w-7xl pt-12 pb-6 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto text-center md:text-left">
                        <div className="text-[10px] font-black tracking-widest text-[#d9d2c5]">OBSIDIAN INTEL</div>
                        <div className="hidden md:block h-3 w-[1px] bg-[#3a3939]"></div>
                        <div className="text-[10px] text-gray-500">
                            © 2024 Leadit Intelligence. All rights reserved.
                        </div>
                    </div>
                    <div className="flex gap-6 text-[10px] text-gray-500 font-medium">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Terms of Service</Link>
                        <Link href="#" className="hover:text-white">Security</Link>
                    </div>
                </footer>
            </div>
        </>
    );
}