import { getTrustLevelEmoji, getTrustLevelColor, getTrustLevelLabel } from "@/lib/trust-score";
import type { TrustLevel } from "@prisma/client";

interface TrustScoreBadgeProps {
  score: number;
  level: TrustLevel;
  variant?: "compact" | "full" | "inline";
  showScore?: boolean;
}

export function TrustScoreBadge({
  score,
  level,
  variant = "compact",
  showScore = true,
}: TrustScoreBadgeProps) {
  const emoji = getTrustLevelEmoji(level);
  const color = getTrustLevelColor(level);
  const label = getTrustLevelLabel(level);

  if (variant === "inline") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: color,
          border: "1.5px solid #000",
          borderRadius: "4px",
          padding: "2px 8px",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          color: level === "MEMBER" ? "#000" : level === "NEWCOMER" ? "#fff" : "#000",
        }}
      >
        {emoji} {label}
        {showScore && <span style={{ opacity: 0.7 }}>· {score}</span>}
      </span>
    );
  }

  if (variant === "full") {
    return (
      <div
        style={{
          background: "#F5F0E8",
          border: "2px solid #000",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "4px 4px 0px #000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px" }}>
            {emoji} Trust Score
          </span>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "32px" }}>
            {score}
          </span>
        </div>
        {/* Progress bar */}
        <div
          style={{
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "4px",
            height: "12px",
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: `${score}%`,
              height: "100%",
              background: color,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              background: color,
              border: "1.5px solid #000",
              borderRadius: "4px",
              padding: "2px 10px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              color: level === "MEMBER" ? "#000" : level === "NEWCOMER" ? "#fff" : "#000",
            }}
          >
            {label}
          </span>
          <span style={{ fontSize: "12px", color: "#3D3D3D" }}>
            {score < 31 ? `${31 - score} pts to Member` : score < 61 ? `${61 - score} pts to Trusted` : score < 86 ? `${86 - score} pts to Verified` : "Max level! 🎉"}
          </span>
        </div>
      </div>
    );
  }

  // compact
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "#F5F0E8",
        border: "2px solid #000",
        borderRadius: "6px",
        padding: "4px 10px",
        boxShadow: "2px 2px 0px #000",
      }}
    >
      <span style={{ fontSize: "14px" }}>{emoji}</span>
      <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "13px" }}>
        {showScore ? score : label}
      </span>
    </div>
  );
}
