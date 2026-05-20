"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import GuestGuard from "@/components/auth/GuestGuard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", position: "relative" }}>
      {/* Floating Back Button - Desktop */}
      <div className="hidden lg:block">
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            zIndex: 50,
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "8px 16px",
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "14px",
            color: "#000",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "4px 4px 0px #000",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #000"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px #000"; }}
        >
          ← Kembali
        </Link>
      </div>

      {/* Left Side: Brand/Marketing (Hidden on mobile) */}
      <div 
        className="hidden lg:flex" 
        style={{ 
          flex: 1, 
          background: "#FFE500", 
          flexDirection: "column", 
          justifyContent: "center",
          padding: "60px",
          borderRight: "4px solid #000",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative Grid Background */}
        <div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)", 
            backgroundSize: "30px 30px", 
            opacity: 0.1 
          }} 
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(48px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-2px", color: "#000" }}>
            FIND YOUR <br />
            <span style={{ background: "#000", color: "#FFE500", padding: "0 12px", display: "inline-block", transform: "rotate(-1deg)" }}>PEOPLE.</span> <br />
            BUILD <br />
            TOGETHER.
          </h2>
          <p style={{ marginTop: "32px", fontSize: "20px", fontWeight: 600, maxWidth: "450px", lineHeight: 1.5, color: "#000" }}>
            Platform kolaborasi Gen-Z untuk project, lomba, dan komunitas kreatif.
          </p>
        </div>
      </div>

      <GuestGuard>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
            <div style={{ width: "100%", maxWidth: "460px", position: "relative" }}>
              {/* Mobile Back Button - Aligned with Card */}
              <div className="lg:hidden" style={{ marginBottom: "20px" }}>
                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#fff",
                    border: "2px solid #000",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 800,
                    fontSize: "14px",
                    color: "#000",
                    textDecoration: "none",
                    boxShadow: "4px 4px 0px #000",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #000"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px #000"; }}
                >
                  ← Kembali
                </Link>
              </div>
              {children}
            </div>
          </main>

          <footer style={{ textAlign: "center", padding: "24px", fontSize: "12px", color: "#666", fontWeight: 600 }}>
            © {new Date().getFullYear()} CollaboLab — Built with ⚡ by Team Galatea
          </footer>
        </div>
      </GuestGuard>
    </div>
  );
}
