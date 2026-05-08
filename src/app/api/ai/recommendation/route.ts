
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAIGate } from "@/lib/ai/gate";
import { AI_TOOL_CONFIG } from "@/lib/ai/config";
import { getProjectRecommendations } from "@/lib/ai/recommendation";
import { prisma } from "@/lib/prisma";
import { addHours } from "date-fns";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gate = await checkAIGate(session.user.id, "PROJECT_RECOMMENDATION");
  if (!gate.allowed) return NextResponse.json(gate, { status: 403 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        skills: { select: { skillName: true } },
        memberships: { 
          include: { project: { select: { category: true, commitmentLevel: true } } }
        }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const openProjectsRaw = await prisma.project.findMany({
      where: { 
        status: "OPEN",
        ownerId: { not: session.user.id },
        id: { notIn: user.memberships.map(m => m.projectId) }
      },
      take: 20, // Keep it manageable for context
      include: { requiredSkills: { select: { skillName: true } } }
    });

    const userContext = {
      skills: user.skills.map(s => s.skillName),
      dnaType: "BUILDER", // Fallback for now
      availability: (user as any).availStatus || "OPEN",
      trustLevel: user.trustLevel,
      completedProjectCategories: Array.from(new Set(user.memberships.map(m => m.project.category))),
      preferredCommitmentLevel: user.memberships[0]?.project.commitmentLevel || "SERIUS"
    };

    const openProjects = openProjectsRaw.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      skills: p.requiredSkills.map(s => s.skillName),
      commitmentLevel: p.commitmentLevel,
    }));

    const result = await getProjectRecommendations(userContext, openProjects);

    await prisma.aIToolUsage.create({
      data: {
        userId: session.user.id,
        toolType: "PROJECT_RECOMMENDATION",
        expiresAt: addHours(new Date(), AI_TOOL_CONFIG.PROJECT_RECOMMENDATION.cooldownHours),
        result: {
          create: {
            userId: session.user.id,
            toolType: "PROJECT_RECOMMENDATION",
            input: {},
            output: result,
          }
        }
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[AI Recommendation Error]", err);
    return NextResponse.json({ error: err.message || "Gagal merekomendasikan project." }, { status: 500 });
  }
}
