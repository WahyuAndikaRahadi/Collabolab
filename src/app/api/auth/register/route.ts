import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid: " + parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
      }
      // Re-send OTP for unverified user
      const otp = generateOtp();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);
      await prisma.user.update({
        where: { email },
        data: { otpCode: otp, otpExpiry: expiry, password: hashSync(password, 12) },
      });
      await sendVerificationEmail(email, existing.name, otp);
      return NextResponse.json({ message: "OTP baru dikirim ke email kamu." });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 12),
        otpCode: otp,
        otpExpiry: expiry,
        trustScore: 20,
        trustLevel: "NEWCOMER",
        availStatus: "OPEN",
      },
    });

    await sendVerificationEmail(email, name, otp);

    return NextResponse.json({ message: "Akun dibuat. Cek email untuk OTP." }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
