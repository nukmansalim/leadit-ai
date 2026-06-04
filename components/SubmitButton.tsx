import React from "react";

interface SubmitButtonProps {
    loading: boolean;
    text: string;
    loadingText: string;
    disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    loading,
    text,
    loadingText,
    disabled
}) => {
    return (
        <button
            type="submit"
            disabled={disabled || loading}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#2563EB]/30 active:scale-[0.98] mt-1"
        >
            {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : null}
            {loading ? loadingText : text}
            {!loading && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            )}
        </button>
    );
};
