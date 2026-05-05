"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SKILL_SUGGESTIONS } from "@/types";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";

type Step = 1 | 2 | 3;

const AVAIL_OPTIONS = [
  { value: "OPEN", label: "🟢 Open to Collab", desc: "Aktif mencari project baru" },
  { value: "FOCUS", label: "🟡 Fokus Dulu", desc: "Sibuk, tapi bisa dihubungi" },
  { value: "BUSY", label: "🔴 Sibuk", desc: "Tidak tersedia saat ini" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();

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
      if (!res.ok) throw new Error("Gagal menyimpan profil.");
      await update({ onboardingDone: true });
      router.refresh();
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  // Estimated initial trust score
  const estimatedScore = 20 + (selectedSkills.length >= 3 ? 10 : 0) + (bio.length > 20 ? 5 : 0) + (links.linkedin ? 8 : 0) + (links.github ? 4 : 0) + (links.portfolio ? 4 : 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", padding: "32px 16px" }}>
      {/* Progress indicator */}
      <div style={{ maxWidth: "640px", margin: "0 auto 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px" }}>
            🤝 Setup Profilmu
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

            {/* Skill suggestions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {SKILL_SUGGESTIONS.filter((s) => !selectedSkills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="skill-chip"
                  id={`skill-suggest-${skill.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Custom skill */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="custom-skill-input"
                type="text"
                className="nb-input"
                placeholder="Tambah skill lain..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                style={{ flex: 1 }}
              />
              <button onClick={addCustomSkill} className="btn-secondary btn-sm" id="add-custom-skill-btn">
                + Tambah
              </button>
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

            {/* Trust Score Preview */}
            <div style={{ marginBottom: "28px" }}>
              <TrustScoreBadge
                score={estimatedScore}
                level={estimatedScore >= 86 ? "VERIFIED" : estimatedScore >= 61 ? "TRUSTED" : estimatedScore >= 31 ? "MEMBER" : "NEWCOMER"}
                variant="full"
              />
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
                  GitHub <span style={{ background: "#00D37F", color: "#000", border: "1px solid #000", borderRadius: "3px", fontSize: "10px", padding: "1px 6px", fontWeight: 700 }}>+4 pts</span>
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
                  Portfolio / Website <span style={{ background: "#00D37F", color: "#000", border: "1px solid #000", borderRadius: "3px", fontSize: "10px", padding: "1px 6px", fontWeight: 700 }}>+4 pts</span>
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
            {isLoading ? "Menyimpan..." : step < 3 ? "Lanjut →" : "🎉 Selesai & Masuk Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
