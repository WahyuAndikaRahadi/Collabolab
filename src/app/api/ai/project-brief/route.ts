
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAIGate } from "@/lib/ai/gate";
import { AI_TOOL_CONFIG } from "@/lib/ai/config";
import { generateProjectBrief } from "@/lib/ai/project-brief";
import { prisma } from "@/lib/prisma";
import { addHours } from "date-fns";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gate = await checkAIGate(session.user.id, "PROJECT_BRIEF_GENERATOR");
  if (!gate.allowed) return NextResponse.json(gate, { status: 403 });

  try {
    const { idea, category, sdgHint } = await req.json();
    if (!idea || idea.length < 20) {
      return NextResponse.json({ error: "Ide project terlalu pendek (min 20 karakter)." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { skills: { select: { skillName: true } } }
    });

    const result = await generateProjectBrief(
      idea, 
      category, 
      sdgHint, 
      user?.skills.map(s => s.skillName)
    );

    await prisma.aIToolUsage.create({
      data: {
        userId: session.user.id,
        toolType: "PROJECT_BRIEF_GENERATOR",
        expiresAt: addHours(new Date(), AI_TOOL_CONFIG.PROJECT_BRIEF_GENERATOR.cooldownHours),
        result: {
          create: {
            userId: session.user.id,
            toolType: "PROJECT_BRIEF_GENERATOR",
            input: { idea, category, sdgHint },
            output: result,
          }
        }
      }
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[AI Brief Error]", err);
    return NextResponse.json({ error: err.message || "Gagal generate brief." }, { status: 500 });
  }
}
