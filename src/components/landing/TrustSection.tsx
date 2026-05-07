"use client";

import { motion } from "framer-motion";

export function TrustSection() {
  return (
    <section
      id="trust"
      style={{
        background: "#F5F0E8",
        borderBottom: "3px solid #000",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span className="section-label">🛡️ TRUST & KOMUNITAS</span>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(28px, 4vw, 48px)",
              marginTop: "8px",
            }}
          >
            Ekosistem yang sehat dimulai dari kepercayaan.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          {/* Trust Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            id="trust-score-card"
            style={{
              background: "#fff",
              border: "3px solid #000",
              borderRadius: "8px",
              boxShadow: "6px 6px 0px #000",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decoration */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "120px",
                height: "120px",
                border: "2px dashed #000",
                borderRadius: "50%",
              }}
            />

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: "56px", marginBottom: "16px" }}
            >
              🛡️
            </motion.div>

            <h3
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              Trust Score System
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
              Setiap aksi di CollaboLab mempengaruhi Trust Score-mu. Selesaikan project, dapat review positif,
              dan jadilah kontributor yang dipercaya. Score-mu adalah reputasimu.
            </p>

            {/* Level display */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { range: "0–30", level: "🔴 Newcomer", desc: "Mulai perjalananmu", color: "#FF4D4D" },
                { range: "31–60", level: "🟡 Member", desc: "Bisa buat project", color: "#FFE500" },
                { range: "61–85", level: "🟢 Trusted", desc: "Full akses + invite", color: "#00D37F" },
                { range: "86–100", level: "🔵 Verified", desc: "Badge khusus + prioritas", color: "#0047FF" },
              ].map(({ range, level, desc, color }) => (
                <div
                  key={range}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    background: "#F5F0E8",
                    border: "1.5px solid #000",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "36px",
                      background: color,
                      border: "1.5px solid #000",
                      borderRadius: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px" }}>
                      {level}
                    </div>
                    <div style={{ fontSize: "12px", color: "#3D3D3D" }}>{desc}</div>
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      fontWeight: 500,
                      background: "#fff",
                      border: "1.5px solid #000",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    {range}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Anonymous Mode Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            id="anonymous-mode-card"
            style={{
              background: "#fff",
              border: "3px solid #000",
              borderRadius: "8px",
              boxShadow: "6px 6px 0px #000",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decoration */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "60px",
                height: "60px",
                background: "#0047FF",
                border: "2px solid #000",
                transform: "rotate(45deg)",
                opacity: 0.2,
              }}
            />

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: "48px", marginBottom: "16px" }}
            >
              🕵️
            </motion.div>

            <h3
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "24px",
                marginBottom: "12px",
                color: "#000",
              }}
            >
              Anonymous Ice-Breaker Mode
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
              Introvert? Tidak masalah. Join project dengan username anonim —
              kenalan dulu, reveal identitas asli kapanpun kamu siap.
            </p>

            {/* Demo chat-like */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { name: "Anon#4827", msg: "Hei! Aku bisa bantu di bagian frontend 👋", you: false },
                { name: "Kamu", msg: "Sip! Mulai dari component apa dulu?", you: true },
                { name: "Anon#4827", msg: "Sudah reveal! — ini Rina dari ITS 😊", you: false, revealed: true },
              ].map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: msg.you ? "row-reverse" : "row",
                    gap: "8px",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: msg.revealed ? "#00D37F" : msg.you ? "#FFE500" : "#F5F0E8",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {msg.revealed ? "😊" : msg.you ? "😎" : "👤"}
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#666", marginBottom: "3px", textAlign: msg.you ? "right" : "left" }}>
                      {msg.name}
                    </div>
                    <div
                      style={{
                        background: msg.you ? "#FFE500" : msg.revealed ? "#00D37F" : "#fff",
                        color: "#000",
                        border: "2px solid #000",
                        borderRadius: msg.you ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        padding: "8px 14px",
                        fontSize: "13px",
                        maxWidth: "220px",
                        boxShadow: "2px 2px 0px #000",
                      }}
                    >
                      {msg.revealed && (
                        <span style={{ fontSize: "10px", display: "block", marginBottom: "3px", fontWeight: 800 }}>
                          ✨ Identitas terungkap!
                        </span>
                      )}
                      {msg.msg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
