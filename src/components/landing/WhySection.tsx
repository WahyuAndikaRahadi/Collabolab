"use client";

import { motion } from "framer-motion";

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
    problem: "Komunitas penuh spam & ghost?",
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
        background: "#fff",
        backgroundImage: "radial-gradient(#eee 2px, transparent 2px)",
        backgroundSize: "32px 32px",
        borderBottom: "3px solid #000",
        padding: "100px 24px",
      }}
    >
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {painPoints.map((item, index) => (
            <motion.div
              key={item.id}
              id={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{
                background: "#fff",
                border: "3px solid #000",
                borderRadius: "8px",
                boxShadow: "6px 6px 0px #000",
                padding: "32px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.15s ease",
                cursor: "default",
                transform: `rotate(${index === 0 ? -1.5 : index === 1 ? 1.2 : -0.8}deg)`,
              }}
              whileHover={{
                y: 4,
                x: 4,
                boxShadow: "2px 2px 0px #000",
                rotate: 0,
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
              {/* Sticker badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  background: "#000",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 900,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transform: "rotate(-5deg)",
                  border: "1.5px solid #000",
                }}
              >
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
