"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Adit",
    role: "Fullstack Dev",
    avatar: "🧑‍💻",
    text: "Akhirnya dapet tim hackathon yang beneran komit lewat CollaboLab!",
    color: "#FFE500",
  },
  {
    name: "Siska",
    role: "UI Designer",
    avatar: "🎨",
    text: "Sistem Trust Score-nya ngebantu banget buat filter partner yang ghosting.",
    color: "#00D37F",
  },
  {
    name: "Budi",
    role: "Product Manager",
    avatar: "📊",
    text: "Dapet partner project startup cuma dalam hitungan hari. Gila sih!",
    color: "#0047FF",
    textColor: "#fff",
  },
  {
    name: "Rina",
    role: "Frontend Dev",
    avatar: "👩‍💻",
    text: "Fitur Anonymous-nya ngebantu banget buat aku yang introvert pas awal kenalan.",
    color: "#FF4D4D",
    textColor: "#fff",
  },
  {
    name: "Farhan",
    role: "Back-end",
    avatar: "⚙️",
    text: "Kanban board-nya simpel dan real-time. Kerja jadi lebih sat-set!",
    color: "#FFFFFF",
  },
  {
    name: "Lia",
    role: "Content Creator",
    avatar: "📸",
    text: "Nemu komunitas buat collab konten kreatif jadi gampang banget di sini.",
    color: "#FFE500",
  },
];

const row1 = [...testimonials, ...testimonials];
const row2 = [...testimonials.reverse(), ...testimonials];

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ background: "#FFFFFF", padding: "100px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: "60px" }}>
        <span className="section-label">💬 TESTIMONI</span>
        <h2
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 4vw, 48px)",
            marginTop: "8px",
          }}
        >
          Kata mereka yang sudah kolaborasi.
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Row 1: Right to Left (Wait, user said Top to Right, Bottom to Left) */}
        {/* Actually usually marquee is right-to-left. But user said "atas ke kanan" (top to right) */}
        <div style={{ display: "flex", width: "fit-content" }}>
          <motion.div
            animate={{ x: [ -2000, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", gap: "24px", paddingRight: "24px" }}
          >
            {row1.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Left to Right (Wait, user said "bawah ke kiri" -> bottom to left) */}
        <div style={{ display: "flex", width: "fit-content" }}>
          <motion.div
            animate={{ x: [ 0, -2000] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", gap: "24px", paddingRight: "24px" }}
          >
            {row2.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text, color, textColor = "#000" }: any) {
  return (
    <div
      style={{
        background: color,
        border: "3px solid #000",
        borderRadius: "12px",
        padding: "24px",
        width: "320px",
        boxShadow: "6px 6px 0px #000",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <p style={{ color: textColor, fontSize: "15px", fontWeight: 500, lineHeight: 1.6, flex: 1 }}>
        "{text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: `1px solid ${textColor}44`, paddingTop: "16px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <h4 style={{ color: textColor, fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", margin: 0 }}>
            {name}
          </h4>
          <p style={{ color: textColor, fontSize: "12px", opacity: 0.8, margin: 0 }}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
