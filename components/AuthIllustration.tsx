import React from "react";

interface AuthIllustrationProps {
    type: "login" | "register";
}

export const AuthIllustration: React.FC<AuthIllustrationProps> = ({ type }) => {
    if (type === "login") {
        return (
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
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold">
                                    {['A', 'B', 'C', 'D'][i]}
                                </div>
                            ))}
                        </div>
                        <p className="text-white/60 text-sm">Dipercaya 500+ perusahaan</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
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
    );
};
