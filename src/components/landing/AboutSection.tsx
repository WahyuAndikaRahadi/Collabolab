"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: "#FFFFFF",
        padding: "100px 24px",
        borderTop: "3px solid #000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 items-center"
        >
          {/* 1. Label - Always at the top */}
          <div className="order-1">
            <span className="section-label">TENTANG KAMI</span>
          </div>

          {/* 2. Image - Order 2 on mobile, Order 2 on Desktop (right column) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2"
            style={{
              background: "transparent",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <img 
              src="/images/foto1.png" 
              alt="CollaboLab" 
              style={{ 
                maxWidth: "100%", 
                height: "auto", 
                maxHeight: "450px",
                objectFit: "contain",
                filter: "drop-shadow(10px 10px 0px rgba(0,0,0,0.05))",
              }} 
            />
          </motion.div>

          {/* 3. Text Content - Order 3 on mobile, Order 2 on Desktop (below label) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-3 lg:order-2 lg:col-start-1"
          >
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: 1.1,
                marginBottom: "24px",
                marginTop: "0", // Removed margin top because label is now separate
              }}
            >
              Kenalan Lebih Dekat <br />
              dengan <span style={{ color: "#FFE500", textShadow: "1px 1px 0px #000" }}>CollaboLab.</span>
            </h2>
            
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.7,
                color: "#3D3D3D",
                marginBottom: "24px",
              }}
            >
              CollaboLab adalah platform kolaborasi inovatif yang dirancang khusus untuk memfasilitasi kreativitas Gen-Z. 
              Dengan mengintegrasikan sistem reputasi yang transparan dan ruang kerja real-time, kami menciptakan 
              ekosistem di mana setiap ide memiliki kesempatan untuk tumbuh menjadi project nyata yang berdampak luas.
            </p>

            <p style={{ fontStyle: "italic", color: "#666", fontSize: "15px", borderLeft: "4px solid #FFE500", paddingLeft: "16px", marginTop: "32px" }}>
              "Kami percaya bahwa inovasi terbaik lahir dari kolaborasi, bukan kompetisi yang menjatuhkan." 
              <br />
              <span style={{ fontWeight: 700, color: "#000", marginTop: "8px", display: "inline-block" }}>— CollaboLab Team</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
