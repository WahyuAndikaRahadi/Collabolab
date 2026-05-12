
"use client";

import { useState } from "react";
import { ArrowLeft, BarChart2, RefreshCw, Quote, ShieldCheck, TrendingUp } from "lucide-react";

interface Props {
  onBack: () => void;
}

export function ReviewSummarizer({ onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/review-summary", { method: "POST" });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Gagal membuat ringkasan.");
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

      <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "12px", boxShadow: "6px 6px 0px #000", padding: "32px", marginBottom: "40px" }}>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <BarChart2 color="#FFE500" /> Perangkum Ulasan
        </h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>Dapatkan wawasan mendalam dari semua ulasan rekan kerja yang kamu terima. Temukan kelebihanmu dan area untuk berkembang.</p>

        {!result ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>📊</div>
            <p style={{ marginBottom: "24px", fontWeight: 700 }}>Rangkum reputasimu menjadi wawasan berharga.</p>
            {error && <div style={{ background: "#FF4D4D", color: "#fff", padding: "12px", borderRadius: "6px", fontWeight: 700, fontSize: "14px", marginBottom: "20px" }}>⚠️ {error}</div>}
            <button
              onClick={handleSummarize}
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
              {loading ? <RefreshCw className="animate-spin" /> : <TrendingUp />}
              {loading ? "AI LAGI MERANGKUM..." : "RANGKUM REVIEW SAYA"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
              <div style={{ background: "#000", color: "#FFE500", border: "2px solid #000", borderRadius: "12px", padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "8px" }}>RATA-RATA RATING</div>
                <div style={{ fontSize: "64px", fontWeight: 900, fontFamily: "Space Grotesk, sans-serif" }}>{result.averageRating}</div>
                <div style={{ fontSize: "20px", color: "#fff" }}>⭐ ⭐ ⭐ ⭐</div>
              </div>
              
              <div style={{ background: "#F5F0E8", border: "2px solid #000", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontWeight: 900, fontSize: "18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <TrendingUp size={20} /> LABEL SIKAP TERBANYAK
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {result.topBehaviorTags.map((tag: any, i: number) => (
                    <div key={i} style={{ background: "#fff", border: "1.5px solid #000", padding: "6px 12px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 900 }}>{tag.tag}</span>
                      <span style={{ background: "#000", color: "#FFE500", fontSize: "12px", padding: "2px 6px", borderRadius: "4px" }}>x{tag.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "#00D37F", border: "3px solid #000", borderRadius: "12px", padding: "24px", position: "relative" }}>
                <Quote size={48} style={{ position: "absolute", top: "12px", right: "20px", opacity: 0.2 }} />
                <h3 style={{ fontWeight: 900, fontSize: "18px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={20} /> KEKUATAN KONSISTEN
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{result.strengths}</p>
              </div>

              <div style={{ background: "#FFE500", border: "3px solid #000", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontWeight: 900, fontSize: "18px", marginBottom: "12px" }}>🔶 AREA PENGEMBANGAN</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{result.improvements}</p>
              </div>

              <div style={{ background: "#0047FF", color: "#fff", border: "3px solid #000", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontWeight: 900, fontSize: "18px", marginBottom: "12px" }}>💡 REKOMENDASI KONKRET</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{result.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
