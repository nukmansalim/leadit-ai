import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, name, company_name } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ message: "Data tidak Lengkap" }, { status: 400 })
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            return NextResponse.json({ message: "akun sudah terdaftar" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email, name, company_name: company_name || null, password: hashedPassword
            }
        })
        return NextResponse.json({
            message: "Akun Berhasil Dibuat!"
            , user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}