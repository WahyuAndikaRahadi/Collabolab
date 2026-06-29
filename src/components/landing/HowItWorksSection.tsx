"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "./CountUp";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: 1,
    title: "Buat profil & pilih skill",
    description:
      "Daftar 30 detik. Pilih skill tags kamu — Riset, Penulisan, Akuntansi, atau apapun yang kamu jago. Trust Score dimulai.",
    icon: "🎯",
    color: "#FFE500",
    id: "step-create-profile",
  },
  {
    number: 2,
    title: "Temukan project yang cocok",
    description:
      "Explore feed project dengan Skill Match Indicator. Lihat berapa persen skillmu cocok dengan project yang ada.",
    icon: "🔍",
    color: "#00D37F",
    id: "step-find-project",
  },
  {
    number: 3,
    title: "Kolaborasi di Collab Hub",
    description:
      "Chat real-time, kanban board, dan presence indicator — semua dalam satu room. Mulai bangun sesuatu yang keren.",
    icon: "🚀",
    color: "#0047FF",
    id: "step-collaborate",
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardOneRef = useRef<HTMLDivElement>(null);
  const cardTwoRef = useRef<HTMLDivElement>(null);
  const cardThreeRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=300%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          cardOneRef.current,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.9, duration: 1 }
        )
          .fromTo(
            cardTwoRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1 },
            "-=0.2"
          )
          .to(cardTwoRef.current, { opacity: 0, scale: 0.9, duration: 1 })
          .fromTo(
            cardThreeRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1 },
            "-=0.2"
          );
      }, containerRef);

      return () => ctx.revert();
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.set([cardOneRef.current, cardTwoRef.current, cardThreeRef.current], {
        opacity: 1,
        scale: 1,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        background: "#F5F0E8",
        borderBottom: "3px solid #000",
        position: "relative",
      }}
    >
      {/* Section heading — sits above the pin so it scrolls in naturally */}
      <div
        style={{
          padding: "80px 24px 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", paddingBottom: "40px" }}>
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
      </div>

      {/* Pinned card container — desktop: h-screen with stacked absolute cards */}
      <div
        ref={containerRef}
        className="relative w-full lg:h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#F5F0E8" }}
      >
        {/* Geometric decorations — static, inside pin container */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "-80px",
              width: "300px",
              height: "300px",
              border: "4px solid #0047FF",
              borderRadius: "50%",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "5%",
              width: "80px",
              height: "80px",
              background: "#FF4D4D",
              border: "3px solid #000",
              boxShadow: "6px 6px 0px #000",
              opacity: 0.4,
              transform: "rotate(-10deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: "70px",
              height: "70px",
              opacity: 0.4,
            }}
          >
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
              <path d="M50 5 L95 85 L5 85 Z" fill="#00D37F" stroke="#000" strokeWidth="6" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: "3%",
              width: "120px",
              height: "120px",
              border: "3px dashed #FFE500",
              borderRadius: "50%",
              opacity: 0.3,
              transform: "rotate(0deg)",
            }}
          />
          <div style={{ position: "absolute", top: "45%", left: "3%", fontSize: "32px", fontWeight: 900, opacity: 0.05, transform: "rotate(-20deg)" }}>×</div>
          <div style={{ position: "absolute", bottom: "35%", right: "12%", fontSize: "28px", fontWeight: 900, opacity: 0.07, transform: "rotate(10deg)" }}>O</div>
          <div style={{ position: "absolute", top: "15%", left: "45%", fontSize: "24px", fontWeight: 900, opacity: 0.1 }}>+</div>
          <div style={{ position: "absolute", top: "25%", right: "15%", display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: "6px", opacity: 0.1 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: "4px", height: "4px", background: "#000", borderRadius: "50%" }} />
            ))}
          </div>
          <div style={{ position: "absolute", bottom: "15%", left: "20%", display: "grid", gridTemplateColumns: "repeat(6, 6px)", gap: "5px", opacity: 0.08 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: "3px", height: "3px", background: "#000", borderRadius: "50%" }} />
            ))}
          </div>
        </div>

        {/* Desktop: Stacked absolute cards */}
        <div
          className="hidden lg:block relative w-full"
          style={{ maxWidth: "720px", height: "440px", margin: "0 auto" }}
        >
          {/* Card 01 */}
          <div
            ref={cardOneRef}
            id={steps[0].id}
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "48px",
              borderRadius: "12px",
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-30px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "120px",
                lineHeight: 1,
                color: steps[0].color,
                WebkitTextStroke: "3px #000",
                opacity: 0.8,
                zIndex: -1,
              }}
            >
              01
            </div>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: steps[0].color,
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
              {steps[0].icon}
            </div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "16px" }}>
              {steps[0].title}
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "17px", lineHeight: 1.6, margin: 0 }}>
              {steps[0].description}
            </p>
          </div>

          {/* Card 02 */}
          <div
            ref={cardTwoRef}
            id={steps[1].id}
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "48px",
              borderRadius: "12px",
              opacity: 0,
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-30px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "120px",
                lineHeight: 1,
                color: steps[1].color,
                WebkitTextStroke: "3px #000",
                opacity: 0.8,
                zIndex: -1,
              }}
            >
              02
            </div>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: steps[1].color,
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
              {steps[1].icon}
            </div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "16px", color: "#00D37F" }}>
              {steps[1].title}
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "17px", lineHeight: 1.6, margin: 0 }}>
              {steps[1].description}
            </p>
          </div>

          {/* Card 03 */}
          <div
            ref={cardThreeRef}
            id={steps[2].id}
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "48px",
              borderRadius: "12px",
              opacity: 0,
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-30px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "120px",
                lineHeight: 1,
                color: steps[2].color,
                WebkitTextStroke: "3px #000",
                opacity: 0.8,
                zIndex: -1,
              }}
            >
              03
            </div>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: steps[2].color,
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
              {steps[2].icon}
            </div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "16px", color: "#0047FF" }}>
              {steps[2].title}
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "17px", lineHeight: 1.6, margin: 0 }}>
              {steps[2].description}
            </p>
          </div>
        </div>

        {/* Mobile: Normal stacked vertical layout (no pinning) */}
        <div
          className="lg:hidden w-full"
          style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "60px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", width: "2px", height: "100%", borderLeft: "4px dashed #000", opacity: 0.08, transform: "translateX(-50%)", zIndex: 0 }} />
            {steps.map((step, index) => (
              <div
                key={step.id}
                id={`${step.id}-mobile`}
                style={{
                  background: "#fff",
                  border: "3px solid #000",
                  boxShadow: "8px 8px 0px #000",
                  padding: "40px",
                  borderRadius: "12px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
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
                  0<CountUp from={0} to={step.number} separator="," direction="up" duration={1} className="count-up-text" delay={0} />
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
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "16px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "#3D3D3D", fontSize: "17px", lineHeight: 1.6, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colorful Zig-Zag Divider */}
      <div
        style={{
          position: "absolute",
          bottom: "-2px",
          left: 0,
          width: "100%",
          height: "40px",
          background: "repeating-linear-gradient(to right, rgba(255, 229, 0, 0.7) 0%, rgba(255, 229, 0, 0.7) 10%, rgba(0, 211, 127, 0.7) 10%, rgba(0, 211, 127, 0.7) 20%, rgba(255, 77, 77, 0.7) 20%, rgba(255, 77, 77, 0.7) 30%, rgba(0, 71, 255, 0.7) 30%, rgba(0, 71, 255, 0.7) 40%)",
          clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)",
          zIndex: 10,
        }}
      />
    </section>
  );
}
