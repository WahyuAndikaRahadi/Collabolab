import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTrustLevel, refreshUserTrustScore } from "@/lib/trust-score";
import { verifyExternalLink, detectPlatform } from "@/lib/link-verifier";
import { ExternalPlatform } from "@prisma/client";
import { z } from "zod";

const onboardingSchema = z.object({
  skills: z.array(z.string().min(1)).min(3),
  bio: z.string().max(300).optional().nullable(),
  availStatus: z.enum(["OPEN", "FOCUS", "BUSY"]),
  linkedinUrl: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
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
      console.error("[onboarding] Validation error:", parsed.error.format());
      return NextResponse.json({ 
        error: "Data tidak valid.", 
        details: parsed.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { skills, bio, availStatus, linkedinUrl, portfolioUrl } = parsed.data;

    // Helper to normalize URLs
    const normalizeUrl = (url: string | null | undefined) => {
      if (!url) return null;
      const trimmed = url.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      return `https://${trimmed}`;
    };

    const cleanLinkedin = normalizeUrl(linkedinUrl);
    const cleanPortfolio = normalizeUrl(portfolioUrl);

    // Process external links with verification
    const linkUrls = [
      { url: cleanLinkedin, platform: "LINKEDIN" as ExternalPlatform },
      { url: cleanPortfolio, platform: "PORTFOLIO" as ExternalPlatform },
    ].filter(l => l.url);

    if (linkUrls.length > 0) {
      await Promise.all(linkUrls.map(async (l) => {
        const verification = await verifyExternalLink(l.url!);
        if (verification.isValid) {
          await prisma.externalLink.create({
            data: {
              userId: session.user.id,
              url: l.url!,
              platform: verification.platform as ExternalPlatform,
              username: verification.username,
              previewTitle: verification.previewTitle,
              previewImage: verification.previewImage,
              status: "VERIFIED",
              visibility: "MEMBERS_ONLY",
              verifiedAt: new Date(),
            }
          });
        }
      }));
    }

    // Delete old skills and re-create
    await prisma.userSkill.deleteMany({ where: { userId: session.user.id } });
    await prisma.userSkill.createMany({
      data: skills.map((skillName) => ({ userId: session.user.id, skillName })),
    });

    // Refresh final trust score including links
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { externalLinks: true }
    });
    
    let finalScore = updatedUser?.trustScore || 20;
    let finalLevel = updatedUser?.trustLevel || "NEWCOMER";

    if (updatedUser) {
      const result = refreshUserTrustScore(updatedUser);
      finalScore = result.score;
      finalLevel = result.level;
    }

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: bio || null,
        availStatus,
        trustScore: finalScore,
        trustLevel: finalLevel,
        onboardingDone: true,
      },
    });

    return NextResponse.json({ message: "Onboarding selesai!", trustScore: finalScore });
  } catch (err) {
    console.error("[onboarding]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
