import React from "react";
import Link from "next/link";

interface AuthShellProps {
    illustration: React.ReactNode;
    children: React.ReactNode;
    badgeText: string;
    badgeTheme: "blue" | "teal";
    title: React.ReactNode;
    subtitle: React.ReactNode;
    footerLinkPrefix: string;
    footerLinkText: string;
    footerLinkHref: string;
    mobileGradientClass: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
    illustration,
    children,
    badgeText,
    badgeTheme,
    title,
    subtitle,
    footerLinkPrefix,
    footerLinkText,
    footerLinkHref,
    mobileGradientClass
}) => {
    const badgeThemeClasses =
        badgeTheme === "blue"
            ? "border-[#2563EB]/20 bg-[#2563EB]/5 text-[#2563EB]"
            : "border-[#0D9488]/20 bg-[#0D9488]/5 text-[#0D9488]";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col lg:flex-row overflow-hidden relative">
            {/* Left Side - Decorative Gradient Panel (Desktop only) */}
            {illustration}

            {/* Right Side - Form Container */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
                {/* Mobile gradient strip */}
                <div className={`lg:hidden absolute top-0 left-0 right-0 h-2 ${mobileGradientClass}`}></div>

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
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${badgeThemeClasses} text-[10px] font-bold tracking-[0.2em] uppercase mb-6`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse"></div>
                        {badgeText}
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-2 leading-tight text-[#0F172A]">
                        {title}
                    </h1>
                    <p className="text-[#64748B] text-center mb-8">
                        {subtitle}
                    </p>

                    {children}

                    <p className="mt-10 text-[#64748B]">
                        {footerLinkPrefix}{" "}
                        <Link
                            href={footerLinkHref}
                            className="text-[#2563EB] font-bold hover:text-[#1d4ed8] underline underline-offset-4 decoration-[#2563EB]/40 hover:decoration-[#2563EB]"
                        >
                            {footerLinkText}
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
};
