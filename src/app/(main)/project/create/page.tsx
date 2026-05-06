"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SKILL_SUGGESTIONS, CATEGORY_META, COMMITMENT_META, SDG_META } from "@/types";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "LOMBA",
    commitmentLevel: "SERIUS",
    sdgTag: "SDG8",
    maxMembers: 4,
    deadline: "",
  });

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  }

  function addCustomSkill() {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) setSelectedSkills((prev) => [...prev, trimmed]);
    setCustomSkill("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title || form.title.length < 5) return setError("Judul minimal 5 karakter.");
    if (!form.description || form.description.length < 20) return setError("Deskripsi minimal 20 karakter agar calon anggota paham tujuan projectmu.");
    if (selectedSkills.length === 0) return setError("Pilih minimal 1 skill yang dibutuhkan.");

    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxMembers: Number(form.maxMembers),
          requiredSkills: selectedSkills,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat project.");
      router.push(`/project/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)", padding: "32px 16px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <span className="section-label">🚀 BUAT PROJECT</span>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 40px)", margin: "8px 0 8px" }}>
            Mulai sesuatu yang keren
          </h1>
          <p style={{ color: "#3D3D3D", fontSize: "16px" }}>
            Ceritakan projectmu dan temukan tim yang tepat.
          </p>
        </div>

        {error && (
          <div style={{ background: "#FFF0F0", border: "2px solid #FF4D4D", borderRadius: "6px", padding: "14px 20px", marginBottom: "24px", color: "#FF4D4D", fontWeight: 600 }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", boxShadow: "8px 8px 0px #000", padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Title */}
            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Judul Project (min. 5 karakter) *
              </label>
              <input
                id="create-project-title"
                type="text"
                className="nb-input"
                placeholder="Contoh: App Wisata Lokal dengan AR"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                maxLength={100}
              />
            </div>

            {/* Category + Commitment */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  Kategori *
                </label>
                <select
                  id="create-project-category"
                  className="nb-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {Object.entries(CATEGORY_META).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  Commitment Level *
                </label>
                <select
                  id="create-project-commitment"
                  className="nb-select"
                  value={form.commitmentLevel}
                  onChange={(e) => setForm({ ...form, commitmentLevel: e.target.value })}
                >
                  {Object.entries(COMMITMENT_META).map(([key, val]) => (
                    <option key={key} value={key}>{val.label} — {val.description}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SDG Tag + Max Members */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  SDG Tag *
                </label>
                <select
                  id="create-project-sdg"
                  className="nb-select"
                  value={form.sdgTag}
                  onChange={(e) => setForm({ ...form, sdgTag: e.target.value })}
                >
                  {Object.entries(SDG_META).map(([key, val]) => (
                    <option key={key} value={key}>{val.label} — {val.description}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  Maks. Anggota
                </label>
                <input
                  id="create-project-max-members"
                  type="number"
                  className="nb-input"
                  min={2}
                  max={20}
                  value={form.maxMembers}
                  onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Deadline (opsional)
              </label>
              <input
                id="create-project-deadline"
                type="datetime-local"
                className="nb-input"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Deskripsi Project (min. 20 karakter) *
              </label>
              <textarea
                id="create-project-description"
                className="nb-textarea"
                placeholder="Ceritakan secara detail: apa projectnya, tujuannya, apa yang akan dikerjakan, dan kenapa orang harus join..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                style={{ minHeight: "140px" }}
              />
              <span style={{ fontSize: "12px", color: form.description.length < 20 ? "#FF4D4D" : "#999" }}>
                {form.description.length}/2000 {form.description.length < 20 && "(min. 20)"}
              </span>
            </div>

            {/* Required Skills */}
            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Skill yang Dibutuhkan *
              </label>

              {selectedSkills.length > 0 && (
                <div style={{ marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedSkills.map((skill) => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)} className="skill-chip selected" id={`project-skill-${skill.replace(/\s+/g, "-").toLowerCase()}`}>
                      {skill} ✕
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                {SKILL_SUGGESTIONS.filter((s) => !selectedSkills.includes(s)).slice(0, 20).map((skill) => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)} className="skill-chip" id={`suggest-${skill.replace(/\s+/g, "-").toLowerCase()}`}>
                    {skill}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  id="create-project-custom-skill"
                  type="text"
                  className="nb-input"
                  placeholder="Tambah skill lain..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addCustomSkill} className="btn-secondary btn-sm" id="create-project-add-skill-btn">
                  + Tambah
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              id="create-project-submit-btn"
              disabled={isLoading}
              style={{ fontSize: "17px", padding: "16px", marginTop: "8px" }}
            >
              {isLoading ? "Membuat project..." : "🚀 Buat Project & Cari Tim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
