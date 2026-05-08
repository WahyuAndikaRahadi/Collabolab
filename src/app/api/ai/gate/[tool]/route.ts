
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAIGate } from "@/lib/ai/gate";
import { AITool } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tool: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tool } = await params;
  
  if (!Object.values(AITool).includes(tool as AITool)) {
    return NextResponse.json({ error: "Invalid tool" }, { status: 400 });
  }

  const result = await checkAIGate(session.user.id, tool as AITool);
  return NextResponse.json(result);
}
