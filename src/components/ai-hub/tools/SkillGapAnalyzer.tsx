
"use client";

import { useState } from "react";
import { ArrowLeft, Search, RefreshCw, AlertTriangle, Target, Briefcase } from "lucide-react";

interface Props {
  onBack: () => void;
}

export function SkillGapAnalyzer({ onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/skill-gap", { method: "POST" });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Gagal analisis.");
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
          <Search color="#0047FF" /> Penganalisis Kekurangan Keahlian
        </h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>AI akan membandingkan skill-mu dengan project yang sedang aktif untuk menemukan apa yang perlu kamu pelajari.</p>

        {!result ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🔍</div>
            <p style={{ marginBottom: "24px", fontWeight: 700 }}>Siap menemukan potensimu?</p>
            {error && <div style={{ background: "#FF4D4D", color: "#fff", padding: "12px", borderRadius: "6px", fontWeight: 700, fontSize: "14px", marginBottom: "20px" }}>⚠️ {error}</div>}
            <button
              onClick={handleAnalyze}
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
              {loading ? <RefreshCw className="animate-spin" /> : <Target />}
              {loading ? "AI LAGI ANALISIS..." : "MULAI ANALISIS"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ background: "#F5F0E8", border: "2px solid #000", borderRadius: "8px", padding: "24px" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px", marginBottom: "16px" }}>GAP YANG DITEMUKAN</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {result.gaps.map((gap: any, i: number) => (
                  <div key={i} style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 900, fontSize: "16px" }}>{gap.skill}</span>
                      <span style={{ 
                        background: gap.priority === "HIGH" ? "#FF4D4D" : gap.priority === "MEDIUM" ? "#FFE500" : "#00D37F",
                        color: gap.priority === "HIGH" ? "#fff" : "#000",
                        padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 800
                      }}>{gap.priority === "HIGH" ? "PRIORITAS TINGGI" : gap.priority === "MEDIUM" ? "PRIORITAS SEDANG" : "PRIORITAS RENDAH"}</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#3D3D3D", marginBottom: "12px" }}>{gap.reasoning}</p>
                    <div style={{ borderTop: "1px dashed #ccc", paddingTop: "12px" }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>COCOK UNTUK PROJECT:</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {gap.relevantProjects?.map((p: string) => (
                          <span key={p} style={{ background: "#F5F0E8", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0047FF", color: "#fff", border: "2px solid #000", borderRadius: "8px", padding: "20px" }}>
              <h3 style={{ fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>KESIMPULAN AI</h3>
              <p style={{ lineHeight: 1.6 }}>{result.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
