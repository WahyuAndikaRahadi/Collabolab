"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Buat profil & pilih skill",
    description:
      "Daftar 30 detik. Pilih skill tags kamu — Riset, Penulisan, Akuntansi, atau apapun yang kamu jago. Trust Score dimulai.",
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
      id="how-it-works"
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
            display: "flex",
            flexDirection: "column",
            gap: "100px",
            position: "relative",
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              id={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                display: "flex",
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                alignItems: "center",
                gap: "40px",
                position: "relative",
              }}
            >
              {/* Card */}
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  border: "3px solid #000",
                  boxShadow: "8px 8px 0px #000",
                  padding: "40px",
                  borderRadius: "12px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Big overlapping number */}
                <div
                  style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-30px",
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: "120px",
                    lineHeight: 1,
                    color: step.color,
                    WebkitTextStroke: "3px #000",
                    opacity: 0.8,
                    zIndex: -1,
                  }}
                >
                  {step.number}
                </div>

                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background: step.color,
                    border: "3px solid #000",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    marginBottom: "24px",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  {step.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: "28px",
                    marginBottom: "16px",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    color: "#3D3D3D",
                    fontSize: "17px",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Spacer */}
              <div className="hidden md:block" style={{ flex: 1 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
