import React from "react";

interface AuthInputProps {
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

export const AuthInput: React.FC<AuthInputProps> = ({
    label,
    type,
    placeholder,
    id,
    icon,
    rightElement,
    value,
    onChange,
    required,
    hasError
}) => (
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
                className={`w-full bg-white border ${
                    hasError ? "border-[#F43F5E] ring-2 ring-[#F43F5E]/20" : "border-[#e2e8f0]"
                } rounded-xl py-3.5 ${
                    icon ? "pl-11" : "px-4"
                } pr-4 text-[#0F172A] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200`}
            />
        </div>
    </div>
);
