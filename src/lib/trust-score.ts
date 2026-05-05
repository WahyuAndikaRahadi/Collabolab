import type { TrustLevel } from "@prisma/client";

export const TRUST_SCORE_DELTAS = {
  PROJECT_COMPLETED: 15,
  GOOD_REVIEW: 10,
  PROFILE_COMPLETE: 10,
  WEEKLY_ACTIVE: 2,
  SOCIAL_LINKS_VERIFIED: 8,
  STUDENT_VERIFIED: 10,
  REPORTED_AND_PROVEN: -20,
  NO_SHOW_GHOST: -10,
  KICKED_FROM_PROJECT: -8,
} as const;

export function calculateTrustLevel(score: number): TrustLevel {
  if (score >= 86) return "VERIFIED";
  if (score >= 61) return "TRUSTED";
  if (score >= 31) return "MEMBER";
  return "NEWCOMER";
}

export function getTrustLevelEmoji(level: TrustLevel): string {
  const map: Record<TrustLevel, string> = {
    NEWCOMER: "🔴",
    MEMBER: "🟡",
    TRUSTED: "🟢",
    VERIFIED: "🔵",
  };
  return map[level];
}

export function getTrustLevelColor(level: TrustLevel): string {
  const map: Record<TrustLevel, string> = {
    NEWCOMER: "#FF4D4D",
    MEMBER: "#FFE500",
    TRUSTED: "#00D37F",
    VERIFIED: "#0047FF",
  };
  return map[level];
}

export function getTrustLevelLabel(level: TrustLevel): string {
  const map: Record<TrustLevel, string> = {
    NEWCOMER: "Newcomer",
    MEMBER: "Member",
    TRUSTED: "Trusted",
    VERIFIED: "Verified",
  };
  return map[level];
}

export function canCreateProject(level: TrustLevel): boolean {
  return level !== "NEWCOMER";
}

export function canInviteDirectly(level: TrustLevel): boolean {
  return level === "TRUSTED" || level === "VERIFIED";
}

export function getMaxActiveProjects(level: TrustLevel): number {
  if (level === "NEWCOMER") return 0;
  if (level === "MEMBER") return 2;
  return Infinity;
}
