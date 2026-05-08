
export const AI_TOOL_CONFIG = {
  PROJECT_BRIEF_GENERATOR: {
    minTrustScore: 31,
    cooldownHours: 8,
    maxPerDay: 3,
  },
  SKILL_GAP_ANALYZER: {
    minTrustScore: 20,
    cooldownHours: 24,
    maxPerDay: 1,
  },
  PROJECT_RECOMMENDATION: {
    minTrustScore: 20,
    cooldownHours: 6,
    maxPerDay: 4,
  },
  REVIEW_SUMMARIZER: {
    minTrustScore: 36,
    cooldownHours: 72,
    maxPerDay: 1,
  },
} as const;
