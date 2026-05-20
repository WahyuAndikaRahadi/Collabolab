"use client";

import { motion } from "framer-motion";
import { TiltWrapper } from "./TiltWrapper";

const painPoints = [
  {
    icon: "🧩",
    problem: "Punya ide tapi tidak ada tim?",
    solution:
      "Temukan kolaborator berdasarkan skill yang kamu butuhkan — bukan hanya pertemanan.",
    color: "#FFE500",
    id: "why-card-team",
  },
  {
    icon: "🫣",
    problem: "Susah mulai kenalan online?",
    solution:
      "Anonymous Ice-Breaker Mode: bergabung dulu dengan nama anonim, reveal kapan kamu siap.",
    color: "#00D37F",
    id: "why-card-introvert",
  },
  {
    icon: "🚫",
    problem: "Komunitas penuh spam?",
    solution:
      "Sistem Trust Score multi-layer memastikan hanya orang serius yang ada di projectmu.",
    color: "#FF4D4D",
    id: "why-card-trust",
  },
];

export function WhySection() {
  return (
    <section
      id="why"
      style={{
        background: "#FFFFFF",
        borderBottom: "3px solid #000",
        padding: "clamp(60px, 10vh, 100px) 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Geometric decorations */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>

        {/* Giant Background Text */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-5deg)",
          fontSize: "clamp(60px, 15vw, 220px)",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,0,0,0.06)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 0,
          fontFamily: "Space Grotesk, sans-serif",
          opacity: 0.5,
        }}>
          REAL PROBLEMS
        </div>

        {/* Yellow Floating Box bottom-right */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "5%",
            right: "2%",
            width: "120px",
            height: "120px",
            background: "#FFE500",
            border: "3px solid #000",
            boxShadow: "10px 10px 0px #000",
            opacity: 0.6,
          }}
        />

        {/* Floating Sticker: GEN-Z ONLY */}
        <motion.div
          className="hidden sm:block"
          animate={{ x: [0, 10, 0], rotate: [-10, -5, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            background: "#0047FF",
            color: "#fff",
            padding: "8px 16px",
            border: "2px solid #000",
            boxShadow: "4px 4px 0px #000",
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "12px",
            transform: "rotate(-10deg)",
            zIndex: 1,
          }}
        >
          🤘 GEN-Z ONLY
        </motion.div>

        {/* Coral Triangle middle-left */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "30%",
            left: "4%",
            width: "60px",
            height: "60px",
            opacity: 0.4,
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <path d="M50 5 L95 85 L5 85 Z" fill="#FF4D4D" stroke="#000" strokeWidth="6" style={{ filter: "drop-shadow(3px 3px 0px #000)" }} />
          </svg>
        </motion.div>

        {/* Small Mint square top-right */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "40px",
            height: "40px",
            background: "#00D37F",
            border: "2px solid #000",
            boxShadow: "4px 4px 0px #000",
            opacity: 0.5,
            transform: "rotate(-15deg)",
          }}
        />
        
        {/* Dot pattern accent */}
        <div style={{ position: "absolute", top: "50%", right: "5%", display: "grid", gridTemplateColumns: "repeat(3, 8px)", gap: "6px", opacity: 0.15 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: "4px", height: "4px", background: "#000", borderRadius: "50%" }} />
          ))}
        </div>

        <motion.div
          className="hidden sm:block"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "5%",
            left: "15%",
            width: "100px",
            height: "100px",
            border: "3px dashed #0047FF",
            borderRadius: "50%",
            opacity: 0.1,
          }}
        />

        <div className="hidden sm:block" style={{ position: "absolute", top: "35%", left: "5%", fontSize: "32px", fontWeight: 900, opacity: 0.12, color: "#FFE500" }}>★</div>
        <div className="hidden sm:block" style={{ position: "absolute", bottom: "30%", left: "20%", fontSize: "32px", fontWeight: 900, opacity: 0.05, transform: "rotate(45deg)" }}>+</div>
        <div className="hidden sm:block" style={{ position: "absolute", top: "15%", right: "8%", fontSize: "28px", fontWeight: 900, opacity: 0.08 }}>×</div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span className="section-label">❓ KENAPA COLLABOLAB?</span>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(32px, 5vw, 52px)",
              marginTop: "8px",
            }}
          >
            Kita semua pernah merasakan ini.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            padding: "0 10px",
          }}
        >
          {painPoints.map((item, index) => (
            <TiltWrapper
              key={item.id}
              index={index}
              style={{
                perspective: "1000px",
                zIndex: 1,
              }}
            >
              <div
                id={item.id}
                style={{
                  background: "#fff",
                  border: "3px solid #000",
                  borderRadius: "8px",
                  boxShadow: "6px 6px 0px #000",
                  padding: "32px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  minHeight: "260px",
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "6px",
                    background: item.color,
                    borderBottom: "2px solid #000",
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    background: item.color,
                    border: "2px solid #000",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    marginBottom: "20px",
                    boxShadow: "3px 3px 0px #000",
                  }}
                >
                  {item.icon}
                </div>

                {/* Problem */}
                <h3
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 800,
                    fontSize: "20px",
                    marginBottom: "12px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.problem}
                </h3>

                {/* Solution */}
                <p
                  style={{
                    color: "#3D3D3D",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.solution}
                </p>
              </div>
            </TiltWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
