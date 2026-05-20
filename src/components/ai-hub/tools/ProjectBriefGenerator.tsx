
"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Send, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onBack: () => void;
}

export function ProjectBriefGenerator({ onBack }: Props) {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (idea.length < 20) return setError("Ide minimal 20 karakter.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/project-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Gagal generate brief.");
      }
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
          <Sparkles color="#FFE500" fill="#FFE500" /> Pembuat Draft Project
        </h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>Cukup tulis ide projectmu dalam satu atau dua kalimat, AI akan membuatkan draft lengkapnya.</p>

        {!result ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: "8px" }}>Apa ide project kamu? *</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Contoh: Saya ingin membuat platform yang membantu UMKM lokal go digital dengan marketplace sederhana..."
                rows={4}
                style={{ width: "100%", padding: "16px", border: "2px solid #000", borderRadius: "8px", background: "#F5F0E8", fontFamily: "inherit", fontSize: "16px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12px" }}>
                <span style={{ color: idea.length < 20 ? "#FF4D4D" : "#00D37F", fontWeight: 700 }}>{idea.length}/300 karakter</span>
                <span>Minimal 20 karakter</span>
              </div>
            </div>

            {error && <div style={{ background: "#FF4D4D", color: "#fff", padding: "12px", borderRadius: "6px", fontWeight: 700, fontSize: "14px" }}>⚠️ {error}</div>}

            <button
              onClick={handleGenerate}
              disabled={loading || idea.length < 20}
              style={{
                background: "#FFE500",
                border: "2px solid #000",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "4px 4px 0px #000",
                opacity: loading || idea.length < 20 ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
              {loading ? "AI LAGI MIKIR..." : "BUAT DRAFT"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ background: "#F5F0E8", border: "2px solid #000", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ background: "#000", color: "#FFE500", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 800 }}>DRAFT AI</span>
                <button onClick={() => setResult(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}>Generate Ulang</button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#666", textTransform: "uppercase" }}>Judul Project</label>
                <div style={{ fontSize: "20px", fontWeight: 900, fontFamily: "Space Grotesk, sans-serif" }}>{result.title}</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#666", textTransform: "uppercase" }}>Deskripsi</label>
                <p style={{ lineHeight: 1.6 }}>{result.description}</p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {result.requiredSkills?.map((skill: string) => (
                  <span key={skill} style={{ background: "#fff", border: "1.5px solid #000", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 700 }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#666", textTransform: "uppercase" }}>Kategori</label>
                  <div style={{ fontWeight: 800 }}>{result.category}</div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#666", textTransform: "uppercase" }}>Commitment</label>
                  <div style={{ fontWeight: 800 }}>{result.commitmentLevel}</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#00D37F", border: "2px solid #000", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ fontSize: "20px" }}>🔖</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "14px" }}>TOPIK: {result.projectTopic}</div>
                <p style={{ fontSize: "13px", opacity: 0.9 }}>{result.topicReasoning}</p>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = `/project/create?ai_draft=${encodeURIComponent(JSON.stringify(result))}`;
              }}
              style={{
                background: "#FFE500",
                border: "2px solid #000",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "4px 4px 0px #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <Send size={20} /> GUNAKAN DRAFT & POST KE EXPLORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
