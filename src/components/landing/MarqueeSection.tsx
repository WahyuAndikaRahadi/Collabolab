"use client";

import { motion } from "framer-motion";

export function MarqueeSection() {
  const items = [
    "FIND YOUR PEOPLE",
    "BUILD TOGETHER",
    "TRUST SCORE",
    "GEN-Z TECHPRENEUR",
    "ANONYMOUS MODE",
    "REAL-TIME COLLAB",
  ];

  return (
    <div
      style={{
        background: "#FFE500",
        borderTop: "3px solid #000",
        borderBottom: "3px solid #000",
        padding: "12px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
      }}
    >
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ display: "flex", gap: "60px", alignItems: "center" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "24px",
              color: "#000",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
