"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const accentCircleRef = useRef<HTMLDivElement>(null);
  const accentCircleRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom top",
        scrub: 2,
      };

      gsap.to(imageRef.current, {
        y: -60,
        scrollTrigger: trigger,
      });

      gsap.to(accentCircleRef.current, {
        y: 40,
        scrollTrigger: trigger,
      });

      gsap.to(accentCircleRef2.current, {
        y: 30,
        rotate: 15,
        scrollTrigger: trigger,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: "#FFFFFF",
        padding: "clamp(60px, 10vh, 100px) 24px",
        borderTop: "3px solid #000",
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
          transform: "translate(-50%, -50%) rotate(-3deg)",
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
          WHO WE ARE
        </div>

        {/* Yellow Circle top-right — scroll parallax accent (bg plate, moves down) */}
        <div
          ref={accentCircleRef}
          style={{
            position: "absolute",
            top: "8%",
            right: "4%",
            width: "120px",
            height: "120px",
            background: "#FFE500",
            border: "3px solid #000",
            borderRadius: "50%",
            boxShadow: "6px 6px 0px #000",
            opacity: 0.7,
          }}
        />

        {/* Blue Square bottom-left — scroll parallax secondary accent */}
        <div
          ref={accentCircleRef2}
          style={{
            position: "absolute",
            bottom: "12%",
            left: "2%",
            width: "90px",
            height: "90px",
            background: "#0047FF",
            border: "3px solid #000",
            boxShadow: "6px 6px 0px #000",
            opacity: 0.7,
            transform: "rotate(-5deg)",
          }}
        />

        {/* Green Triangle middle-left — static decorative */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "5%",
            width: "70px",
            height: "70px",
            opacity: 0.6,
          }}
        >
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <path
              d="M50 5 L95 85 L5 85 Z"
              fill="#00D37F"
              stroke="#000"
              strokeWidth="6"
              style={{ filter: "drop-shadow(4px 4px 0px #000)" }}
            />
          </svg>
        </div>

        {/* Coral Square floating — static */}
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "40px",
            height: "40px",
            background: "#FF4D4D",
            border: "2px solid #000",
            boxShadow: "4px 4px 0px #000",
            opacity: 0.5,
            transform: "rotate(52deg)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "35%",
            right: "8%",
            width: "100px",
            height: "100px",
            border: "3px dashed #000",
            opacity: 0.3,
            borderRadius: "8px",
            transform: "rotate(12deg)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            width: "30px",
            height: "30px",
            background: "#00D37F",
            border: "2px solid #000",
            borderRadius: "50%",
            opacity: 0.4,
          }}
        />

        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            top: "60%",
            left: "8%",
            width: "50px",
            height: "50px",
            border: "2px solid #0047FF",
            opacity: 0.2,
            transform: "rotate(-15deg)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: "12px",
            height: "12px",
            background: "#FFE500",
            borderRadius: "50%",
            border: "1.5px solid #000",
            opacity: 0.5,
          }}
        />

        <div className="hidden sm:block" style={{ position: "absolute", top: "10%", left: "30%", fontSize: "32px", fontWeight: 900, opacity: 0.1, color: "#FFE500" }}>★</div>
        <div className="hidden sm:block" style={{ position: "absolute", bottom: "35%", right: "5%", fontSize: "24px", fontWeight: 900, opacity: 0.05, transform: "rotate(-10deg)" }}>×</div>
        <div className="hidden sm:block" style={{ position: "absolute", top: "15%", left: "5%", fontSize: "28px", fontWeight: 900, opacity: 0.08, color: "#FF4D4D" }}>●</div>

        {/* Dot patterns */}
        <div style={{ position: "absolute", bottom: "5%", right: "2%", display: "grid", gridTemplateColumns: "repeat(4, 10px)", gap: "8px", opacity: 0.15 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ width: "6px", height: "6px", background: "#000", borderRadius: "50%" }} />
          ))}
        </div>

        <div style={{ position: "absolute", top: "15%", left: "5%", display: "grid", gridTemplateColumns: "repeat(3, 8px)", gap: "6px", opacity: 0.1 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: "4px", height: "4px", background: "#000", borderRadius: "50%" }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 items-center">
          {/* 1. Label */}
          <div className="order-1">
            <span className="section-label">TENTANG KAMI</span>
          </div>

          {/* 2. Image — moves upward faster (depth: foreground subject) */}
          <div
            ref={imageRef}
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
                zIndex: 2,
              }}
            />
          </div>

          {/* 3. Text Content — natural scroll speed (ground truth layer) */}
          <div
            ref={textColRef}
            className="order-3 lg:order-2 lg:col-start-1"
          >
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                top: "-30px",
                left: "-20px",
                display: "grid",
                gridTemplateColumns: "repeat(8, 8px)",
                gap: "6px",
                opacity: 0.2,
                zIndex: -1,
              }}>
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} style={{ width: "4px", height: "4px", background: "#000", borderRadius: "50%" }} />
                ))}
              </div>

              <h2
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(32px, 5vw, 48px)",
                  lineHeight: 1.1,
                  marginBottom: "24px",
                  marginTop: "0",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Kenalan Lebih Dekat <br />
                dengan <span style={{ color: "#FFE500", textShadow: "1px 1px 0px #000" }}>CollaboLab.</span>
              </h2>
            </div>

            <p
              style={{
                fontSize: "clamp(16px, 2.5vw, 18px)",
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
          </div>
        </div>
      </div>
    </section>
  );
}
