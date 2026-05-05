import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
    }

    const { email, code } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email sudah diverifikasi." }, { status: 400 });
    }

    if (!user.otpCode || !user.otpExpiry) {
      return NextResponse.json({ error: "Kode OTP tidak ditemukan." }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "Kode OTP sudah kadaluarsa. Daftar ulang untuk mendapatkan kode baru." }, { status: 400 });
    }

    if (user.otpCode !== code) {
      return NextResponse.json({ error: "Kode OTP tidak valid." }, { status: 400 });
    }

    // Verify email
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        otpCode: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json({ message: "Email berhasil diverifikasi! Silakan login." });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
