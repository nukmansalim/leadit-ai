import React from "react";
import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
    title: "Daftar Akun | Leadit Intelligence",
    description: "Mulai perjalanan intelijen bisnis Anda",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
