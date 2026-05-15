"use client";

import { motion } from "framer-motion";

export function MarqueeSection() {
  const items = [
    "FIND YOUR PEOPLE",
    "BUILD TOGETHER",
    "TRUST SCORE 🏆",
    "GEN-Z TECHPRENEUR 🚀",
    "ANONYMOUS MODE 🤫",
    "REAL-TIME COLLAB ⚡",
    "NO GHOSTING 🚫",
    "SKILL MATCH 🧩",
  ];

  return (
    <div style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>
      {/* First Marquee - Yellow */}
      <div
        style={{
          background: "#FFE500",
          borderTop: "3px solid #000",
          borderBottom: "1.5px solid #000",
          padding: "16px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "flex",
          transform: "rotate(-1deg) scale(1.02)",
          width: "110%",
          marginLeft: "-5%",
          boxShadow: "0 10px 0px rgba(0,0,0,0.1)"
        }}
      >
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 25,
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
                fontSize: "28px",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {item} <span style={{ opacity: 0.3 }}>★</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Second Marquee - Blue (Reverse) */}
      <div
        style={{
          background: "#0047FF",
          borderTop: "1.5px solid #000",
          borderBottom: "3px solid #000",
          padding: "16px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "flex",
          transform: "rotate(1deg) scale(1.02)",
          width: "110%",
          marginLeft: "-5%",
          marginTop: "-10px",
          boxShadow: "0 10px 0px rgba(0,0,0,0.1)"
        }}
      >
        <motion.div
          animate={{ x: [-1000, 0] }}
          transition={{
            duration: 30,
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
                fontSize: "28px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {item} <span style={{ opacity: 0.3 }}>●</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
