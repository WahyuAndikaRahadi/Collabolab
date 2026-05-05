"use client";

import Link from "next/link";
import type { ProjectCategory, CommitmentLevel, TrustLevel } from "@prisma/client";
import { CATEGORY_META } from "@/types";

// Static mock data for the landing page preview (no login required)
const MOCK_PROJECTS: Array<{
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  commitmentLevel: CommitmentLevel;
  requiredSkills: string[];
  maxMembers: number;
  memberCount: number;
  owner: { name: string; trustScore: number; trustLevel: TrustLevel };
}> = [
  {
    id: "mock-1",
    title: "App Wisata Lokal AR untuk Gen-Z",
    description: "Membangun aplikasi augmented reality untuk explore wisata lokal dengan gamifikasi.",
    category: "LOMBA",
    commitmentLevel: "KOMPETISI",
    requiredSkills: ["React Native", "AR", "UI/UX Design"],
    maxMembers: 4,
    memberCount: 2,
    owner: { name: "Rafi A.", trustScore: 82, trustLevel: "TRUSTED" },
  },
  {
    id: "mock-2",
    title: "Platform Marketplace UMKM Digital",
    description: "Startup marketplace untuk produk UMKM lokal dengan sistem pembayaran digital terintegrasi.",
    category: "STARTUP",
    commitmentLevel: "SERIUS",
    requiredSkills: ["Next.js", "PostgreSQL", "UI/UX Design", "Marketing"],
    maxMembers: 5,
    memberCount: 3,
    owner: { name: "Sinta W.", trustScore: 91, trustLevel: "VERIFIED" },
  },
  {
    id: "mock-3",
    title: "Komunitas Ilustrasi Digital Bareng",
    description: "Kolaborasi buat zine digital bulanan — ilustrasi, desain, dan storytelling bareng.",
    category: "KREATIF",
    commitmentLevel: "CASUAL",
    requiredSkills: ["Illustrator", "Figma", "Content Writing"],
    maxMembers: 6,
    memberCount: 4,
    owner: { name: "Davin R.", trustScore: 67, trustLevel: "TRUSTED" },
  },
  {
    id: "mock-4",
    title: "Belajar Machine Learning Bareng (Pemula)",
    description: "Study group untuk belajar ML dari nol — kaggle, paper reading, dan mini project bersama.",
    category: "BELAJAR",
    commitmentLevel: "CASUAL",
    requiredSkills: ["Python", "Machine Learning"],
    maxMembers: 8,
    memberCount: 5,
    owner: { name: "Ayu P.", trustScore: 45, trustLevel: "MEMBER" },
  },
];

function getTrustEmoji(level: TrustLevel) {
  const map: Record<TrustLevel, string> = {
    NEWCOMER: "🔴",
    MEMBER: "🟡",
    TRUSTED: "🟢",
    VERIFIED: "🔵",
  };
  return map[level];
}

function CommitmentBadge({ level }: { level: CommitmentLevel }) {
  const map: Record<CommitmentLevel, { label: string; bg: string }> = {
    CASUAL: { label: "Casual", bg: "#00D37F" },
    SERIUS: { label: "Serius", bg: "#0047FF" },
    KOMPETISI: { label: "Kompetisi", bg: "#FF4D4D" },
  };
  const { label, bg } = map[level];
  return (
    <span
      style={{
        background: bg,
        color: level === "SERIUS" || level === "KOMPETISI" ? "#fff" : "#000",
        border: "1.5px solid #000",
        borderRadius: "4px",
        padding: "2px 8px",
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 700,
        fontSize: "11px",
      }}
    >
      {label}
    </span>
  );
}

export function ExplorePreview() {
  return (
    <section
      style={{
        background: "#fff",
        borderBottom: "3px solid #000",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="section-label">🔍 EXPLORE PREVIEW</span>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(28px, 4vw, 48px)",
              marginTop: "8px",
            }}
          >
            Project yang lagi cari anggota
          </h2>
          <p style={{ color: "#3D3D3D", fontSize: "16px", marginTop: "8px" }}>
            Ini baru sebagian kecil. Login untuk lihat semua + skill match kamu.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {MOCK_PROJECTS.map((project, index) => {
            const cat = CATEGORY_META[project.category];
            const spotsLeft = project.maxMembers - project.memberCount;

            return (
              <div
                key={project.id}
                id={`preview-card-${index + 1}`}
                style={{
                  background: "#fff",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  boxShadow: "4px 4px 0px #000",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "2px 2px 0px #000";
                  (e.currentTarget as HTMLDivElement).style.transform = "translate(2px, 2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "4px 4px 0px #000";
                  (e.currentTarget as HTMLDivElement).style.transform = "translate(0, 0)";
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      background: cat.color,
                      border: "1.5px solid #000",
                      borderRadius: "4px",
                      padding: "3px 10px",
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    {cat.emoji} {cat.label}
                  </span>
                  <CommitmentBadge level={project.commitmentLevel} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 800,
                    fontSize: "17px",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: "#3D3D3D",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.description}
                </p>

                {/* Skills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {project.requiredSkills.map((skill) => (
                    <span key={skill} className="skill-chip" style={{ cursor: "default" }}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1.5px solid #e0e0e0",
                    marginTop: "auto",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px" }}>
                      {getTrustEmoji(project.owner.trustLevel)}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {project.owner.name}
                    </span>
                    <span
                      style={{
                        background: "#F5F0E8",
                        border: "1.5px solid #000",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      {project.owner.trustScore}
                    </span>
                  </div>
                  <span
                    style={{
                      background: spotsLeft <= 1 ? "#FF4D4D" : "#00D37F",
                      color: spotsLeft <= 1 ? "#fff" : "#000",
                      border: "1.5px solid #000",
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    {spotsLeft} slot tersisa
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/explore"
            className="btn-secondary"
            id="explore-preview-see-all"
            style={{ fontSize: "16px" }}
          >
            Lihat Semua Project →
          </Link>
          <p style={{ marginTop: "12px", fontSize: "13px", color: "#3D3D3D" }}>
            Login untuk melihat persentase Skill Match dan fitur apply
          </p>
        </div>
      </div>
    </section>
  );
}
