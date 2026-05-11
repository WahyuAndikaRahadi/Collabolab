"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SKILL_SUGGESTIONS, SKILL_GROUPS } from "@/types";
import { getTrustLevelEmoji, getTrustLevelColor, getTrustLevelLabel } from "@/lib/trust-score";
import AuthGuard from "@/components/auth/AuthGuard";

type Step = 1 | 2 | 3;

const AVAIL_OPTIONS = [
  { value: "OPEN", label: "🟢 Open to Collab", desc: "Aktif mencari project baru" },
  { value: "FOCUS", label: "🟡 Fokus Dulu", desc: "Sibuk, tapi bisa dihubungi" },
  { value: "BUSY", label: "🔴 Sibuk", desc: "Tidak tersedia saat ini" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Redirect ADMINs away from onboarding
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [session, status, router]);

  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [bio, setBio] = useState("");
  const [availStatus, setAvailStatus] = useState("OPEN");
  const [links, setLinks] = useState({ linkedin: "", github: "", portfolio: "" });

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function addCustomSkill() {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkill("");
  }

  const [showSuccess, setShowSuccess] = useState(false);

  async function handleComplete() {
    if (step === 1 && selectedSkills.length < 3) {
      setError("Pilih minimal 3 skill.");
      return;
    }
    if (step < 3) {
      setError("");
      setStep((s) => (s + 1) as Step);
      return;
    }

    // Final submit
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: selectedSkills,
          bio,
          availStatus,
          linkedinUrl: links.linkedin || null,
          githubUrl: links.github || null,
          portfolioUrl: links.portfolio || null,
        }),
      });

      const data = await res.json();
      const newScore: number = data.trustScore ?? 20;
      const newLevel = newScore >= 86 ? "VERIFIED" : newScore >= 61 ? "TRUSTED" : newScore >= 31 ? "MEMBER" : "NEWCOMER";

      // Success sequence — sync session with freshly computed trust score
      setShowSuccess(true);
      await update({ onboardingDone: true, trustScore: newScore, trustLevel: newLevel });
      
      // Delay for success animation feel
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setIsLoading(false);
    }
  }

  // Estimated trust score preview matching real trust-score.ts logic
  // Base 20 + LinkedIn(4) + GitHub(4) + Portfolio(4), profile complete bonus(+10 if bio)
  const estimatedScore = 20
    + (links.linkedin ? 4 : 0)
    + (links.github ? 4 : 0)
    + (links.portfolio ? 4 : 0)
    + (bio.length > 20 ? 10 : 0);

  return (
    <AuthGuard>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", padding: "32px 16px" }}>
        {/* Progress indicator */}
        <div style={{ maxWidth: "640px", margin: "0 auto 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px" }}>
               Setup Profilmu
            </div>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: "#3D3D3D" }}>
              Step {step} / 3
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: "8px", background: "#fff", border: "2px solid #000", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "#FFE500",
                width: `${(step / 3) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            {["Skill Tags", "Bio & Status", "Profile Links"].map((label, i) => (
              <span
                key={label}
                style={{
                  fontSize: "12px",
                  fontWeight: step > i ? 700 : 400,
                  color: step > i ? "#000" : "#999",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "#fff",
            border: "3px solid #000",
            borderRadius: "8px",
            boxShadow: "8px 8px 0px #000",
            padding: "40px",
          }}
        >
          {error && (
            <div style={{ background: "#FFF0F0", border: "2px solid #FF4D4D", borderRadius: "6px", padding: "12px 16px", marginBottom: "24px", color: "#FF4D4D", fontWeight: 600, fontSize: "14px" }}>
              ⚠ {error}
            </div>
          )}

          {/* ─── Step 1: Skills ───────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "26px", marginBottom: "8px" }}>
                🎯 Apa skill kamu?
              </h2>
              <p style={{ color: "#3D3D3D", fontSize: "15px", marginBottom: "28px" }}>
                Pilih minimal <strong>3 skill</strong>. Ini yang akan dipakai untuk Skill Match dengan project.
              </p>

              {/* Selected skills */}
              {selectedSkills.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", marginBottom: "8px", color: "#3D3D3D" }}>
                    Dipilih ({selectedSkills.length}):
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="skill-chip selected"
                        id={`skill-selected-${skill.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {skill} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: "#F5F0E8", border: "2px solid #000", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <input
                    id="onboarding-skill-search"
                    type="text"
                    className="nb-input"
                    placeholder="Cari skill kamu..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    style={{ flex: 1, background: "#fff" }}
                  />
                </div>

                {customSkill ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(customSkill.toLowerCase()) && !selectedSkills.includes(s)).slice(0, 15).map(skill => (
                      <button key={skill} type="button" onClick={() => { toggleSkill(skill); setCustomSkill(""); }} className="skill-chip" style={{ background: "#fff" }}>
                        + {skill}
                      </button>
                    ))}
                    {customSkill.trim() && !SKILL_SUGGESTIONS.some(s => s.toLowerCase() === customSkill.toLowerCase()) && (
                      <button type="button" onClick={addCustomSkill} className="skill-chip" style={{ background: "#00D37F", color: "#fff" }}>
                        + Tambah "{customSkill}"
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {SKILL_GROUPS.slice(0, 4).map(group => (
                      <div key={group.name}>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{group.name}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {group.skills.filter(s => !selectedSkills.includes(s)).slice(0, 8).map(skill => (
                            <button key={skill} type="button" onClick={() => toggleSkill(skill)} className="skill-chip" style={{ background: "#fff", fontSize: "12px" }}>
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#3D3D3D", fontStyle: "italic" }}>Gunakan kolom pencarian di atas untuk melihat bidang lainnya...</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Step 2: Bio & Status ─────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "26px", marginBottom: "8px" }}>
                ✍️ Ceritakan dirimu
              </h2>
              <p style={{ color: "#3D3D3D", fontSize: "15px", marginBottom: "28px" }}>
                Bio singkat akan tampil di profil publikmu. Kolaborator akan membacanya saat mempertimbangkan lamaranmu.
              </p>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  Bio Singkat
                </label>
                <textarea
                  id="onboarding-bio"
                  className="nb-textarea"
                  placeholder="Misal: Mahasiswa Informatika semester 4 yang passionate di web development. Suka bangun project yang solve real problems!"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  style={{ minHeight: "100px" }}
                />
                <span style={{ fontSize: "12px", color: "#999" }}>{bio.length}/300 karakter</span>
              </div>

              <div>
                <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "12px" }}>
                  Availability Status
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {AVAIL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      id={`avail-${opt.value.toLowerCase()}`}
                      onClick={() => setAvailStatus(opt.value)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        border: availStatus === opt.value ? "2px solid #000" : "2px solid #ccc",
                        borderRadius: "6px",
                        background: availStatus === opt.value ? "#FFE500" : "#fff",
                        boxShadow: availStatus === opt.value ? "3px 3px 0px #000" : "none",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "13px", color: "#3D3D3D" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 3: Links + Trust Score Reveal ──────────── */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "26px", marginBottom: "8px" }}>
                🔗 Tambahkan link profil
              </h2>
              <p style={{ color: "#3D3D3D", fontSize: "15px", marginBottom: "8px" }}>
                Opsional, tapi boost Trust Score kamu!
              </p>

              <div style={{ marginBottom: "28px" }}>
                <div
                  style={{
                    background: "#F5F0E8",
                    border: "3px solid #000",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#3D3D3D", textTransform: "uppercase" }}>
                      Estimasi Trust Score
                    </span>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "32px", lineHeight: 1 }}>
                      {estimatedScore}
                    </span>
                  </div>
                  
                  <div
                    style={{
                      background: "#fff",
                      border: "2px solid #000",
                      borderRadius: "4px",
                      height: "12px",
                      overflow: "hidden",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: `${estimatedScore}%`,
                        height: "100%",
                        background: getTrustLevelColor(estimatedScore >= 86 ? "VERIFIED" : estimatedScore >= 61 ? "TRUSTED" : estimatedScore >= 31 ? "MEMBER" : "NEWCOMER"),
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        background: getTrustLevelColor(estimatedScore >= 86 ? "VERIFIED" : estimatedScore >= 61 ? "TRUSTED" : estimatedScore >= 31 ? "MEMBER" : "NEWCOMER"),
                        border: "1.5px solid #000",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {getTrustLevelEmoji(estimatedScore >= 86 ? "VERIFIED" : estimatedScore >= 61 ? "TRUSTED" : estimatedScore >= 31 ? "MEMBER" : "NEWCOMER")} {getTrustLevelLabel(estimatedScore >= 86 ? "VERIFIED" : estimatedScore >= 61 ? "TRUSTED" : estimatedScore >= 31 ? "MEMBER" : "NEWCOMER")}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                    LinkedIn <span style={{ background: "#00D37F", color: "#000", border: "1px solid #000", borderRadius: "3px", fontSize: "10px", padding: "1px 6px", fontWeight: 700 }}>+8 pts</span>
                  </label>
                  <input
                    id="onboarding-linkedin"
                    type="url"
                    className="nb-input"
                    placeholder="https://linkedin.com/in/username"
                    value={links.linkedin}
                    onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                    GitHub <span style={{ background: "#00D37F", color: "#000", border: "1px solid #000", borderRadius: "3px", fontSize: "10px", padding: "1px 6px", fontWeight: 700 }}>+8 pts</span>
                  </label>
                  <input
                    id="onboarding-github"
                    type="url"
                    className="nb-input"
                    placeholder="https://github.com/username"
                    value={links.github}
                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                    Portfolio / Website <span style={{ background: "#00D37F", color: "#000", border: "1px solid #000", borderRadius: "3px", fontSize: "10px", padding: "1px 6px", fontWeight: 700 }}>+6 pts</span>
                  </label>
                  <input
                    id="onboarding-portfolio"
                    type="url"
                    className="nb-input"
                    placeholder="https://portofolio.kamu.com"
                    value={links.portfolio}
                    onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
            <button
              onClick={() => step > 1 && setStep((s) => (s - 1) as Step)}
              id="onboarding-back-btn"
              style={{
                background: "transparent",
                border: "2px solid #000",
                borderRadius: "4px",
                padding: "10px 20px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                cursor: step === 1 ? "not-allowed" : "pointer",
                opacity: step === 1 ? 0.3 : 1,
              }}
              disabled={step === 1}
            >
              ← Kembali
            </button>

            <button
              onClick={handleComplete}
              id="onboarding-next-btn"
              className="btn-primary"
              disabled={isLoading}
              style={{ fontSize: "16px", padding: "12px 28px" }}
            >
              {isLoading ? "Menyimpan..." : step < 3 ? "Lanjut →" : "Selesai & Masuk Dashboard"}
            </button>
          </div>
        </div>
        {/* ─── Overlays ────────────────────────────────────── */}
        
        {/* Loading Overlay */}
        {isLoading && !showSuccess && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(245, 240, 232, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
            <div style={{ background: "#fff", border: "4px solid #000", padding: "32px 48px", borderRadius: "12px", boxShadow: "12px 12px 0px #000", textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", border: "4px solid #000", borderTopColor: "#FFE500", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px" }}>Menyimpan Profil...</h3>
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {showSuccess && (
          <div style={{ position: "fixed", inset: 0, background: "#FFE500", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 101 }}>
            <div style={{ background: "#fff", border: "4px solid #000", padding: "48px", borderRadius: "12px", boxShadow: "16px 16px 0px #000", textAlign: "center", maxWidth: "90%", width: "400px", transform: "rotate(-1deg)" }}>
              <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "32px", marginBottom: "12px", lineHeight: 1.1 }}>
                YEAY! <br />SIAP TEMUKAN TIM?
              </h2>
              <p style={{ fontWeight: 600, color: "#3D3D3D", marginBottom: "32px" }}>
                Profilmu sudah keren! <br />Mengarahkan ke Dashboard...
              </p>
              <div style={{ height: "6px", background: "#f0f0f0", border: "2px solid #000", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#00D37F", animation: "progress 2s linear forwards" }} />
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes progress { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    </AuthGuard>
  );
}
