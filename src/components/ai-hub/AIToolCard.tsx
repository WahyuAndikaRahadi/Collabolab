"use client";

import { motion } from "framer-motion";
import { Lock, Clock, CheckCircle2 } from "lucide-react";
import { itemVariants } from "../ui/DecorativeElements";

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  minScore: number;
  userScore: number;
  cooldownHours: number;
  isLocked: boolean;
  onSelect: () => void;
  cooldownRemaining?: string;
  accentColor: string;
  lightColor: string;
}

export function AIToolCard({ 
  title, description, icon, minScore, userScore, cooldownHours, isLocked, onSelect, cooldownRemaining, accentColor, lightColor
}: Props) {
  const isCooldown = cooldownRemaining ? new Date(cooldownRemaining) > new Date() : false;
  const progress = Math.min((userScore / minScore) * 100, 100);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={!isLocked && !isCooldown ? { y: -8, x: -8, boxShadow: `12px 12px 0px #000` } : {}}
      onClick={() => !isLocked && !isCooldown && onSelect()}
      style={{
        background: isLocked ? "#EAEAEA" : lightColor,
        border: "4px solid #000",
        borderRadius: "0px",
        boxShadow: "6px 6px 0px #000",
        padding: "clamp(24px, 4vw, 32px)",
        cursor: isLocked || isCooldown ? "not-allowed" : "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "box-shadow 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      {/* Badge Corner */}
      <div style={{ position: "absolute", top: "-12px", right: "20px", display: "flex", gap: "8px" }}>
        {isLocked ? (
          <div style={{ background: "#000", color: "#fff", padding: "6px 12px", border: "3px solid #000", fontSize: "11px", fontWeight: 900, display: "flex", alignItems: "center", gap: "4px" }}>
            <Lock size={12} /> TERKUNCI
          </div>
        ) : isCooldown ? (
          <div style={{ background: "#FF4D4D", color: "#fff", padding: "6px 12px", border: "3px solid #000", fontSize: "11px", fontWeight: 900, display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={12} /> JEDA WAKTU
          </div>
        ) : (
          <div style={{ background: "#00D37F", color: "#000", padding: "6px 12px", border: "3px solid #000", fontSize: "11px", fontWeight: 900, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={12} /> SIAP
          </div>
        )}
      </div>

      <motion.div 
        whileHover={{ rotate: 10 }}
        style={{ 
          width: "64px", 
          height: "64px", 
          background: isLocked ? "#CCC" : accentColor, 
          color: accentColor === "#0047FF" || accentColor === "#FF4D4D" ? "#fff" : "#000",
          border: "3px solid #000", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "32px",
          marginBottom: "24px",
          boxShadow: "4px 4px 0px #000"
        }}
      >
        {icon}
      </motion.div>

      <h3 style={{ 
        fontFamily: "Space Grotesk, sans-serif", 
        fontWeight: 900, 
        fontSize: "24px", 
        marginBottom: "12px",
        lineHeight: 1.1,
        textTransform: "uppercase",
        letterSpacing: "-0.5px"
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: "#3D3D3D", 
        fontSize: "15px", 
        lineHeight: 1.5, 
        marginBottom: "32px", 
        flex: 1,
        fontWeight: 600 
      }}>
        {description}
      </p>

      <div style={{ background: "#fff", border: "3px solid #000", padding: "16px", marginBottom: "20px", boxShadow: "4px 4px 0px #000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 900, marginBottom: "8px", textTransform: "uppercase" }}>
          <span>Batas Kepercayaan</span>
          <span style={{ color: userScore >= minScore ? "#00D37F" : "#FF4D4D" }}>
            {userScore} / {minScore}
          </span>
        </div>
        <div style={{ width: "100%", height: "14px", background: "#F5F0E8", border: "3px solid #000", overflow: "hidden" }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            style={{ height: "100%", background: progress === 100 ? "#00D37F" : accentColor }} 
          />
        </div>
      </div>

      <button
        style={{
          width: "100%",
          background: isLocked || isCooldown ? "#CCC" : accentColor,
          color: (isLocked || isCooldown) ? "#000" : (accentColor === "#0047FF" || accentColor === "#FF4D4D" ? "#fff" : "#000"),
          border: "3px solid #000",
          padding: "14px",
          fontWeight: 900,
          fontSize: "16px",
          boxShadow: isLocked || isCooldown ? "none" : "4px 4px 0px #000",
          cursor: isLocked || isCooldown ? "not-allowed" : "pointer",
          textTransform: "uppercase",
          letterSpacing: "1px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        {isLocked ? "Naikkan Trust Score" : isCooldown ? "Sedang Jeda" : "Gunakan Alat →"}
      </button>
    </motion.div>
  );
}

