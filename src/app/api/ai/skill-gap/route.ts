
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAIGate } from "@/lib/ai/gate";
import { AI_TOOL_CONFIG } from "@/lib/ai/config";
import { analyzeSkillGap } from "@/lib/ai/skill-gap";
import { prisma } from "@/lib/prisma";
import { addHours } from "date-fns";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gate = await checkAIGate(session.user.id, "SKILL_GAP_ANALYZER");
  if (!gate.allowed) return NextResponse.json(gate, { status: 403 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { skills: { select: { skillName: true } } }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get market demand (top 20 required skills from open projects)
    const marketDemandRaw = await prisma.projectSkill.groupBy({
      by: ["skillName"],
      where: { project: { status: "OPEN" } },
      _count: { skillName: true },
      orderBy: { _count: { skillName: "desc" } },
      take: 15
    });

    const marketDemand = marketDemandRaw.map(s => ({
      skillName: s.skillName,
      count: s._count.skillName
    }));

    // Get sample open projects that user HASN'T joined
    const openProjects = await prisma.project.findMany({
      where: { 
        status: "OPEN",
        ownerId: { not: session.user.id }
      },
      take: 10,
      include: { requiredSkills: { select: { skillName: true } } }
    });

    const result = await analyzeSkillGap(
      user.skills.map(s => s.skillName),
      "BUILDER", // Fallback DNA
      marketDemand,
      openProjects.map(p => ({ title: p.title, skills: p.requiredSkills.map(s => s.skillName) }))
    );

    await prisma.aIToolUsage.create({
      data: {
        userId: session.user.id,
        toolType: "SKILL_GAP_ANALYZER",
        expiresAt: addHours(new Date(), AI_TOOL_CONFIG.SKILL_GAP_ANALYZER.cooldownHours),
        result: {
          create: {
            userId: session.user.id,
            toolType: "SKILL_GAP_ANALYZER",
            input: {},
            output: result,
          }
        }
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[AI Skill Gap Error]", err);
    return NextResponse.json({ error: err.message || "Gagal analisis skill gap." }, { status: 500 });
  }
}
