"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { NoiseTexture, GridPattern, FloatingShape } from "@/components/ui/DecorativeElements";

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#FFE500", 
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
      <FloatingShape type="square" color="#FF4D4D" size={100} top="10%" left="10%" delay={0} />
      <FloatingShape type="circle" color="#0047FF" size={150} bottom="15%" right="10%" delay={0.5} />
      <FloatingShape type="triangle" color="#00D37F" size={80} top="20%" right="15%" delay={1} />

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        style={{
          background: "#fff",
          border: "4px solid #000",
          boxShadow: "12px 12px 0px #000",
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
          color: "#FFE500", 
          padding: "8px 20px", 
          fontSize: "24px", 
          fontWeight: 900, 
          fontFamily: "Space Grotesk, sans-serif",
          display: "inline-block",
          marginBottom: "24px",
          transform: "rotate(-2deg)"
        }}>
          ERROR 404
        </span>

        <h1 style={{ 
          fontFamily: "Space Grotesk, sans-serif", 
          fontWeight: 900, 
          fontSize: "48px", 
          lineHeight: 1, 
          margin: "0 0 16px",
          color: "#000"
        }}>
          Halaman Hilang <br/> Di Universe.
        </h1>

        <p style={{ 
          fontSize: "18px", 
          color: "#3D3D3D", 
          fontWeight: 600, 
          lineHeight: 1.5,
          marginBottom: "40px",
          maxWidth: "400px",
          margin: "0 auto 40px"
        }}>
          Sepertinya koordinat yang kamu masukkan salah atau halaman ini sudah berpindah dimensi.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          <Link 
            href={session ? "/dashboard" : "/"}
            style={{
              background: "#000",
              color: "#fff",
              border: "3px solid #000",
              padding: "16px 32px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              textDecoration: "none",
              boxShadow: "4px 4px 0px #FF4D4D",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "6px 6px 0px #FF4D4D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "4px 4px 0px #FF4D4D";
            }}
          >
            {session ? "🏠 Balik ke Dashboard" : "🏠 Balik ke Beranda"}
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            style={{
              background: "#fff",
              color: "#000",
              border: "3px solid #000",
              padding: "16px 32px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "4px 4px 0px #000",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "6px 6px 0px #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "4px 4px 0px #000";
            }}
          >
            ← Kembali
          </button>
        </div>
      </motion.div>

      {/* Fun 404 Text Background */}
      <div style={{ 
        position: "absolute", 
        fontSize: "20vw", 
        fontWeight: 900, 
        color: "#000", 
        opacity: 0.05, 
        zIndex: 0,
        pointerEvents: "none",
        bottom: "-5%",
        left: "-5%",
        lineHeight: 0.8
      }}>
        404 <br/> NOT <br/> FOUND
      </div>
    </div>
  );
}
