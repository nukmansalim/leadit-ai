import React from "react";

interface AuthCardProps {
    children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
    return (
        <div className="w-full bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.04)] flex flex-col gap-6">
            {children}
        </div>
    );
};
