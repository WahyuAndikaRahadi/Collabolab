import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_META, COMMITMENT_META, SDG_META } from "@/types";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import { ProjectDetailClient } from "@/components/project/ProjectDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await prisma.project.findUnique({ where: { id }, select: { title: true, description: true } });
  return { title: p?.title ?? "Project Detail", description: p?.description?.slice(0, 160) };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      requiredSkills: true,
      owner: { select: { id: true, name: true, image: true, bio: true, trustScore: true, trustLevel: true } },
      members: {
        include: { user: { select: { id: true, name: true, image: true, trustScore: true, trustLevel: true } } },
      },
      tasks: { select: { id: true, status: true } },
    },
  });

  if (!project) redirect("/explore");

  const isMember = project.members.some((m) => m.userId === session?.user?.id);
  const isOwner = project.ownerId === session?.user?.id;
  const cat = CATEGORY_META[project.category];
  const commit = COMMITMENT_META[project.commitmentLevel];
  const sdg = SDG_META[project.sdgTag];

  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const spotsLeft = project.maxMembers - project.members.length;

  const TRUST_EMOJI: Record<string, string> = { NEWCOMER: "🔴", MEMBER: "🟡", TRUSTED: "🟢", VERIFIED: "🔵" };

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Back */}
        <Link href="/explore" style={{ color: "#0047FF", fontWeight: 700, textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "24px" }}>
          ← Kembali ke Explore
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }} className="project-detail-grid">
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Main card */}
            <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", boxShadow: "6px 6px 0px #000", padding: "32px" }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                <span style={{ background: cat.color, border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {cat.emoji} {cat.label}
                </span>
                <span style={{ background: project.commitmentLevel === "KOMPETISI" ? "#FF4D4D" : project.commitmentLevel === "SERIUS" ? "#0047FF" : "#00D37F", color: project.commitmentLevel === "CASUAL" ? "#000" : "#fff", border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {commit.label}
                </span>
                <span style={{ background: sdg.color, color: "#fff", border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {sdg.label}
                </span>
                <span style={{ background: project.status === "OPEN" ? "#00D37F" : "#FF4D4D", color: project.status === "OPEN" ? "#000" : "#fff", border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {project.status === "OPEN" ? "● Open" : project.status}
                </span>
              </div>

              <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(24px, 4vw, 36px)", marginBottom: "16px" }}>
                {project.title}
              </h1>

              {/* Progress */}
              {totalTasks > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>Progress Project</span>
                    <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "13px" }}>{progressPct}%</span>
                  </div>
                  <div style={{ height: "10px", background: "#F5F0E8", border: "2px solid #000", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: "#00D37F", transition: "width 0.5s ease" }} />
                  </div>
                </div>
              )}

              <p style={{ color: "#3D3D3D", fontSize: "16px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {project.description}
              </p>
            </div>

            {/* Required skills */}
            <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0px #000", padding: "24px" }}>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "16px" }}>
                🔧 Skill yang Dibutuhkan
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {project.requiredSkills.map((s) => (
                  <span key={s.skillName} className="skill-chip" style={{ cursor: "default" }}>{s.skillName}</span>
                ))}
              </div>
            </div>

            {/* Members */}
            <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0px #000", padding: "24px" }}>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "16px" }}>
                👥 Anggota ({project.members.length}/{project.maxMembers})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {project.members.map((m) => {
                  const isAnon = m.isAnonymous && !m.revealedAt;
                  const displayName = isAnon ? `Anon#${m.anonymousTag || "0000"}` : m.user.name;
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#F5F0E8", border: "1.5px solid #000", borderRadius: "6px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #000", background: m.role === "OWNER" ? "#FFE500" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "16px" }}>
                        {isAnon ? "👤" : displayName[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px" }}>{displayName}</div>
                        <div style={{ fontSize: "12px", color: "#3D3D3D" }}>{m.role === "OWNER" ? "👑 Owner" : "Member"}</div>
                      </div>
                      {!isAnon && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>{TRUST_EMOJI[m.user.trustLevel]}</span>
                          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>{m.user.trustScore}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Action card */}
            <ProjectDetailClient
              projectId={id}
              isLoggedIn={!!session?.user}
              isMember={isMember}
              isOwner={isOwner}
              status={project.status}
              spotsLeft={spotsLeft}
              commitmentLevel={project.commitmentLevel}
            />

            {/* Owner card */}
            <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0px #000", padding: "20px" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "16px" }}>
                👤 Project Owner
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #000", background: "#FFE500", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px" }}>
                  {project.owner.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "16px" }}>{project.owner.name}</div>
                  <TrustScoreBadge score={project.owner.trustScore} level={project.owner.trustLevel} variant="compact" />
                </div>
              </div>
              {project.owner.bio && (
                <p style={{ fontSize: "13px", color: "#3D3D3D", lineHeight: 1.5 }}>{project.owner.bio}</p>
              )}
              <Link href={`/profile/${project.owner.id}`} className="btn-secondary btn-sm" id="project-detail-owner-profile" style={{ display: "block", textAlign: "center", marginTop: "12px" }}>
                Lihat Profil →
              </Link>
            </div>

            {/* Info */}
            <div style={{ background: "#F5F0E8", border: "2px solid #000", borderRadius: "8px", padding: "20px" }}>
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", marginBottom: "12px" }}>ℹ️ Info Project</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#3D3D3D" }}>Slot tersedia</span>
                  <span style={{ fontWeight: 700 }}>{spotsLeft} dari {project.maxMembers}</span>
                </div>
                {project.deadline && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#3D3D3D" }}>Deadline</span>
                    <span style={{ fontWeight: 700 }}>{new Date(project.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#3D3D3D" }}>Dibuat</span>
                  <span style={{ fontWeight: 700 }}>{new Date(project.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#3D3D3D" }}>SDG</span>
                  <span style={{ fontWeight: 700, color: sdg.color }}>{sdg.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
