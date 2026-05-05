import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTrustLevel } from "@/lib/trust-score";
import { z } from "zod";

const onboardingSchema = z.object({
  skills: z.array(z.string().min(1)).min(3),
  bio: z.string().max(300).optional(),
  availStatus: z.enum(["OPEN", "FOCUS", "BUSY"]),
  linkedinUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  portfolioUrl: z.string().url().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
    }

    const { skills, bio, availStatus, linkedinUrl, githubUrl, portfolioUrl } = parsed.data;

    // Calculate trust score boost
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    let scoreBoost = 10; // profile complete
    if (linkedinUrl) scoreBoost += 8;
    if (githubUrl) scoreBoost += 4;
    if (portfolioUrl) scoreBoost += 4;

    const newScore = Math.min(100, user.trustScore + scoreBoost);
    const newLevel = calculateTrustLevel(newScore);

    // Delete old skills and re-create
    await prisma.userSkill.deleteMany({ where: { userId: session.user.id } });
    await prisma.userSkill.createMany({
      data: skills.map((skillName) => ({ userId: session.user.id, skillName })),
    });

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: bio || null,
        availStatus,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
        trustScore: newScore,
        trustLevel: newLevel,
        onboardingDone: true,
      },
    });

    return NextResponse.json({ message: "Onboarding selesai!", trustScore: newScore });
  } catch (err) {
    console.error("[onboarding]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
