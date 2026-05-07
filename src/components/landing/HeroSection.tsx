"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      style={{
        background: "#F5F0E8",
        backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        borderBottom: "3px solid #000",
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Geometric decorations */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Big yellow block top-right */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [15, 12, 15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "280px",
            height: "280px",
            background: "#FFE500",
            border: "3px solid #000",
            boxShadow: "8px 8px 0px #000",
          }}
        />
        {/* Blue block bottom-left */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [-8, -12, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "60px",
            left: "-20px",
            width: "160px",
            height: "160px",
            background: "#0047FF",
            border: "3px solid #000",
            boxShadow: "6px 6px 0px #000",
          }}
        />
        {/* Green circle bottom-right */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "-30px",
            right: "15%",
            width: "120px",
            height: "120px",
            background: "#00D37F",
            border: "3px solid #000",
            borderRadius: "50%",
            boxShadow: "4px 4px 0px #000",
          }}
        />
        {/* Small coral square */}
        <motion.div
          animate={{ rotate: [20, 380] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "30%",
            right: "5%",
            width: "60px",
            height: "60px",
            background: "#FF4D4D",
            border: "3px solid #000",
            boxShadow: "3px 3px 0px #000",
          }}
        />
        {/* Dashed outline square top-left */}
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "60px",
            left: "40px",
            width: "80px",
            height: "80px",
            border: "3px dashed #000",
            transform: "rotate(-12deg)",
          }}
        />
        {/* Small dot pattern */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "48%",
            display: "grid",
            gridTemplateColumns: "repeat(5, 12px)",
            gap: "10px",
            opacity: 0.25,
          }}
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} style={{ width: "6px", height: "6px", background: "#000", borderRadius: "50%" }} />
          ))}
        </div>

      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="section-label">Bangun Project Impianmu Sekarang</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 80px)",
              lineHeight: 1.05,
              color: "#000",
              marginBottom: "24px",
              marginTop: "16px",
            }}
          >
            Temukan Tim-mu.{" "}
            <span
              style={{
                background: "#FFE500",
                borderBottom: "4px solid #000",
                padding: "0 8px",
                display: "inline-block",
                transform: "rotate(-1deg)",
              }}
            >
              Build Together.
            </span>
          </motion.h1>

          {/* Sub-tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "18px",
              color: "#3D3D3D",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "600px",
            }}
          >
            Platform kolaborasi untuk Gen-Z — temukan partner project, join lomba, dan bangun portofolio bersama.
            Sistem <strong>Trust Score</strong> menjaga ekosistem tetap sehat & anti-spam.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}
          >
            <Link href="/register" className="btn-primary btn-lg" id="hero-cta-register">
              🚀 Mulai Gratis
            </Link>
            <Link href="/explore" className="btn-secondary btn-lg" id="hero-cta-explore">
              Lihat Project →
            </Link>
          </motion.div>

          {/* Social proof & SDG */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              marginTop: "48px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              {/* Avatar stack */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {["🧑‍💻", "👩‍🎨", "🧑‍🔬", "👨‍💼"].map((emoji, i) => (
                  <div
                    key={i}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "2px solid #000",
                      background: ["#FFE500", "#00D37F", "#0047FF", "#FF4D4D"][i],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      marginLeft: i === 0 ? 0 : "-10px",
                      zIndex: 4 - i,
                      position: "relative",
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>
                  Ribuan Gen-Z sudah kolaborasi
                </p>
                <p style={{ fontSize: "12px", color: "#3D3D3D", margin: 0 }}>
                  dari berbagai universitas Indonesia 🇮🇩
                </p>
              </div>
            </div>

            {/* SDG Badges */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <span
                style={{
                  background: "#A21942",
                  color: "#fff",
                  border: "2px solid #000",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  boxShadow: "3px 3px 0px #000",
                }}
              >
                SDG 8
              </span>
              <span
                style={{
                  background: "#FD6925",
                  color: "#fff",
                  border: "2px solid #000",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  boxShadow: "3px 3px 0px #000",
                }}
              >
                SDG 9
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
