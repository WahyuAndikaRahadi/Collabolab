
"use client";

import { useState } from "react";
import { ArrowLeft, Target, RefreshCw, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  onBack: () => void;
}

export function ProjectRecommendation({ onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/recommendation", { method: "POST" });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Gagal merekomendasikan.");
    } catch {
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <button 
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontWeight: 800, marginBottom: "24px" }}
      >
        <ArrowLeft size={20} /> KEMBALI KE HUB
      </button>

      <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "12px", boxShadow: "6px 6px 0px #000", padding: "clamp(20px, 4vw, 32px)", marginBottom: "40px" }}>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Target color="#00D37F" /> Rekomendasi Project
        </h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>Cari project yang paling sesuai dengan skill, DNA, dan preferensi kolaborasimu.</p>

        {!result ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎯</div>
            <p style={{ marginBottom: "24px", fontWeight: 700 }}>Biarkan AI mencarikan tim terbaik untukmu.</p>
            {error && <div style={{ background: "#FF4D4D", color: "#fff", padding: "12px", borderRadius: "6px", fontWeight: 700, fontSize: "14px", marginBottom: "20px" }}>⚠️ {error}</div>}
            <button
              onClick={handleRecommend}
              disabled={loading}
              style={{
                background: "#FFE500",
                border: "2px solid #000",
                padding: "16px 32px",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "4px 4px 0px #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                margin: "0 auto"
              }}
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Star />}
              {loading ? "AI LAGI MENCARI..." : "CARI PROJECT COCOK"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px" }}>REKOMENDASI UNTUKMU</h3>
            {result.recommendations.map((rec: any, i: number) => (
              <div key={i} style={{ background: "#F5F0E8", border: "2px solid #000", borderRadius: "8px", padding: "20px", position: "relative" }}>
                <div style={{ position: "absolute", top: "12px", right: "12px", background: "#000", color: "#FFE500", padding: "4px 10px", borderRadius: "4px", fontSize: "14px", fontWeight: 900 }}>
                  {rec.matchScore}% COCOK
                </div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#666", marginBottom: "4px" }}>REKOMENDASI #{i+1}</div>
                <h4 style={{ fontWeight: 900, fontSize: "18px", marginBottom: "12px", maxWidth: "80%" }}>{rec.projectTitle || `Project ID: ${rec.projectId}`}</h4>
                
                <div style={{ background: "#fff", border: "1.5px solid #000", borderRadius: "6px", padding: "12px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "14px", fontStyle: "italic", color: "#3D3D3D" }}>
                    " {rec.reasoning} "
                  </p>
                </div>

                <Link href={`/project/${rec.projectId}`} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0047FF", fontWeight: 800, fontSize: "14px", textDecoration: "none" }}>
                  LIHAT PROJECT <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
