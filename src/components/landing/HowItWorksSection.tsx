"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Buat profil & pilih skill",
    description:
      "Daftar 30 detik. Pilih skill tags kamu — React, UI/UX, Python, atau apapun yang kamu jago. Trust Score dimulai.",
    icon: "🎯",
    color: "#FFE500",
    id: "step-create-profile",
  },
  {
    number: "02",
    title: "Temukan project yang cocok",
    description:
      "Explore feed project dengan Skill Match Indicator. Lihat berapa persen skillmu cocok dengan project yang ada.",
    icon: "🔍",
    color: "#00D37F",
    id: "step-find-project",
  },
  {
    number: "03",
    title: "Kolaborasi di Collab Room",
    description:
      "Chat real-time, kanban board, dan presence indicator — semua dalam satu room. Mulai bangun sesuatu yang keren.",
    icon: "🚀",
    color: "#0047FF",
    id: "step-collaborate",
  },
];

export function HowItWorksSection() {
  return (
    <section
      style={{
        background: "#F5F0E8",
        borderBottom: "3px solid #000",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span className="section-label">⚡ CARA KERJA</span>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(32px, 5vw, 52px)",
              marginTop: "8px",
            }}
          >
            Tiga langkah. Itu saja.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0",
            position: "relative",
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              id={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "40px 32px",
                border: "3px solid #000",
                borderRight: index < steps.length - 1 ? "3px solid #000" : "3px solid #000",
                marginRight: index < steps.length - 1 ? "-3px" : 0,
                background: "#fff",
                position: "relative",
              }}
            >
              {/* Big number */}
              <div
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 900,
                  fontSize: "80px",
                  lineHeight: 1,
                  color: step.color,
                  WebkitTextStroke: "2px #000",
                  marginBottom: "16px",
                }}
              >
                {step.number}
              </div>

              {/* Icon badge */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: step.color,
                  border: "2px solid #000",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "20px",
                  boxShadow: "3px 3px 0px #000",
                }}
              >
                {step.icon}
              </div>

              <h3
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: "20px",
                  marginBottom: "12px",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  color: "#3D3D3D",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.description}
              </p>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "48px",
                    height: "48px",
                    background: "#FFE500",
                    border: "2px solid #000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "20px",
                    zIndex: 10,
                    boxShadow: "2px 2px 0px #000",
                  }}
                  className="hidden lg:flex"
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
