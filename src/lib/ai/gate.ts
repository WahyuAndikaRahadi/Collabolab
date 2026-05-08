import { prisma } from "@/lib/prisma";
import { AITool } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";
import { AI_TOOL_CONFIG } from "./config";

export type GateResult = 
  | { allowed: true }
  | { allowed: false; reason: "TRUST_SCORE_INSUFFICIENT"; currentScore: number; requiredScore: number }
  | { allowed: false; reason: "COOLDOWN_ACTIVE"; expiresAt: Date; remainingMinutes: number }
  | { allowed: false; reason: "DAILY_LIMIT_REACHED"; resetAt: Date };

export async function checkAIGate(userId: string, tool: AITool): Promise<GateResult> {
  const config = AI_TOOL_CONFIG[tool];
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { trustScore: true },
  });

  if (!user) {
    return { allowed: false, reason: "TRUST_SCORE_INSUFFICIENT", currentScore: 0, requiredScore: config.minTrustScore };
  }

  // 1. Check Trust Score
  if (user.trustScore < config.minTrustScore) {
    return {
      allowed: false,
      reason: "TRUST_SCORE_INSUFFICIENT",
      currentScore: user.trustScore,
      requiredScore: config.minTrustScore,
    };
  }

  // 2. Check Cooldown
  const lastUsage = await prisma.aIToolUsage.findFirst({
    where: { userId, toolType: tool },
    orderBy: { usedAt: "desc" },
  });

  if (lastUsage && lastUsage.expiresAt > new Date()) {
    return {
      allowed: false,
      reason: "COOLDOWN_ACTIVE",
      expiresAt: lastUsage.expiresAt,
      remainingMinutes: Math.ceil((lastUsage.expiresAt.getTime() - Date.now()) / 60000),
    };
  }

  // 3. Check Daily Limit
  const todayUsage = await prisma.aIToolUsage.count({
    where: {
      userId,
      toolType: tool,
      usedAt: { gte: startOfDay(new Date()) },
    },
  });

  if (todayUsage >= config.maxPerDay) {
    return {
      allowed: false,
      reason: "DAILY_LIMIT_REACHED",
      resetAt: endOfDay(new Date()),
    };
  }

  return { allowed: true };
}
