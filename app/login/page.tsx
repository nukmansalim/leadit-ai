import React from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Masuk | Leadit Intelligence",
    description: "Masuk ke akun LEADIT Intelligence Anda",
};

export default function LoginPage() {
    return <LoginForm />;
}
