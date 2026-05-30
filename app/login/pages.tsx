'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/"
        })
        setLoading(false)
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? "Signin In" : "Sign In"}
            </button>
        </form>
    )
}