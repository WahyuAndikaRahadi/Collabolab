"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "FIND YOUR PEOPLE",
  "BUILD TOGETHER",
  "TRUST SCORE 🏆",
  "GEN-Z TECHPRENEUR 🚀",
  "ANONYMOUS MODE 🤫",
  "REAL-TIME COLLAB ⚡",
  "NO GHOSTING 🚫",
  "SKILL MATCH 🧩",
];

const REPEATED_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export function MarqueeSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const yellowTrackRef = useRef<HTMLDivElement>(null);
  const blueTrackRef = useRef<HTMLDivElement>(null);
  const yellowTlRef = useRef<gsap.core.Tween | null>(null);
  const blueTlRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const yellowTrack = yellowTrackRef.current;
    const blueTrack = blueTrackRef.current;
    if (!yellowTrack || !blueTrack) return;

    const yellowWidth = yellowTrack.scrollWidth / 3;
    const blueWidth = blueTrack.scrollWidth / 3;

    yellowTlRef.current = gsap.to(yellowTrack, {
      x: `-=${yellowWidth}`,
      duration: 25,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % yellowWidth),
      },
    });

    blueTlRef.current = gsap.fromTo(
      blueTrack,
      { x: `-${blueWidth}` },
      {
        x: 0,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const val = parseFloat(x) % blueWidth;
            return val > 0 ? val - blueWidth : val;
          }),
        },
      }
    );

    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();
    let decelerateTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const now = performance.now();
      const elapsed = now - lastTimestamp;
      if (elapsed === 0) return;

      const delta = window.scrollY - lastScrollY;
      const velocity = delta / elapsed;

      lastScrollY = window.scrollY;
      lastTimestamp = now;

      const absVel = Math.abs(velocity);
      const speedMultiplier = gsap.utils.clamp(0.5, 6, 1 + absVel * 60);

      const yellowScale = velocity > 0 ? speedMultiplier : Math.max(0.3, 1 / speedMultiplier);
      const blueScale = velocity < 0 ? speedMultiplier : Math.max(0.3, 1 / speedMultiplier);

      if (yellowTlRef.current) {
        gsap.to(yellowTlRef.current, {
          timeScale: yellowScale,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true,
        });
      }

      if (blueTlRef.current) {
        gsap.to(blueTlRef.current, {
          timeScale: blueScale,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true,
        });
      }

      clearTimeout(decelerateTimeout);
      decelerateTimeout = setTimeout(() => {
        if (yellowTlRef.current) {
          gsap.to(yellowTlRef.current, { timeScale: 1, duration: 0.8, ease: "power1.out" });
        }
        if (blueTlRef.current) {
          gsap.to(blueTlRef.current, { timeScale: 1, duration: 0.8, ease: "power1.out" });
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(decelerateTimeout);
      yellowTlRef.current?.kill();
      blueTlRef.current?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>
      {/* Yellow Band */}
      <div
        style={{
          background: "#FFE500",
          borderTop: "3px solid #000",
          borderBottom: "1.5px solid #000",
          padding: "16px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "flex",
          transform: "rotate(-1deg) scale(1.02)",
          width: "110%",
          marginLeft: "-5%",
          boxShadow: "0 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        <div
          ref={yellowTrackRef}
          style={{ display: "flex", gap: "60px", alignItems: "center", willChange: "transform" }}
        >
          {REPEATED_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "28px",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              {item} <span style={{ opacity: 0.3 }}>★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Blue Band (reverse) */}
      <div
        style={{
          background: "#0047FF",
          borderTop: "1.5px solid #000",
          borderBottom: "3px solid #000",
          padding: "16px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "flex",
          transform: "rotate(1deg) scale(1.02)",
          width: "110%",
          marginLeft: "-5%",
          marginTop: "-10px",
          boxShadow: "0 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        <div
          ref={blueTrackRef}
          style={{ display: "flex", gap: "60px", alignItems: "center", willChange: "transform" }}
        >
          {REPEATED_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "28px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              {item} <span style={{ opacity: 0.3 }}>●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
