"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { NoiseTexture, GridPattern, FloatingShape } from "@/components/ui/DecorativeElements";

export default function Forbidden() {
  const { data: session } = useSession();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#FF4D4D", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "24px",
      position: "relative",
      overflow: "hidden"
    }}>
      <NoiseTexture />
      <GridPattern />

      {/* Decorative Shapes */}
      <FloatingShape type="triangle" color="#FFE500" size={120} top="5%" right="10%" delay={0.2} />
      <FloatingShape type="square" color="#00D37F" size={90} bottom="10%" left="5%" delay={0.7} />
      <FloatingShape type="circle" color="#fff" size={60} top="25%" left="20%" delay={1.2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        style={{
          background: "#fff",
          border: "4px solid #000",
          boxShadow: "16px 16px 0px #000",
          padding: "60px 40px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1
        }}
      >
        <span style={{ 
          background: "#000", 
          color: "#FF4D4D", 
          padding: "8px 20px", 
          fontSize: "24px", 
          fontWeight: 900, 
          fontFamily: "Space Grotesk, sans-serif",
          display: "inline-block",
          marginBottom: "24px",
          transform: "rotate(2deg)"
        }}>
          ACCESS DENIED
        </span>

        <h1 style={{ 
          fontFamily: "Space Grotesk, sans-serif", 
          fontWeight: 900, 
          fontSize: "48px", 
          lineHeight: 1.1, 
          margin: "0 0 16px",
          color: "#000"
        }}>
          Dilarang Masuk <br/> Tanpa Izin!
        </h1>

        <p style={{ 
          fontSize: "18px", 
          color: "#3D3D3D", 
          fontWeight: 600, 
          lineHeight: 1.5,
          marginBottom: "40px",
          maxWidth: "450px",
          margin: "0 auto 40px"
        }}>
          Kamu tidak memiliki izin untuk mengakses dimensi ini. Silakan kembali ke area yang aman.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          <Link 
            href={session ? "/dashboard" : "/"}
            style={{
              background: "#FFE500",
              color: "#000",
              border: "3px solid #000",
              padding: "16px 32px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              textDecoration: "none",
              boxShadow: "6px 6px 0px #000",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "8px 8px 0px #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "6px 6px 0px #000";
            }}
          >
            {session ? "🚀 Balik ke Dashboard" : "🏠 Balik ke Beranda"}
          </Link>
        </div>
      </motion.div>

      {/* Warning Text Background */}
      <div style={{ 
        position: "absolute", 
        fontSize: "18vw", 
        fontWeight: 900, 
        color: "#000", 
        opacity: 0.1, 
        zIndex: 0,
        pointerEvents: "none",
        top: "-10%",
        right: "-10%",
        lineHeight: 0.8,
        textAlign: "right"
      }}>
        STOP <br/> 403 <br/> HALT
      </div>
    </div>
  );
}
