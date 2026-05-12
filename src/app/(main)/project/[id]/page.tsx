import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_META, COMMITMENT_META, TOPIC_META } from "@/types";
import { getTrustLevelEmoji, getTrustLevelLabel } from "@/lib/trust-score";
import { ProjectDetailClient } from "@/components/project/ProjectDetailClient";
import { ProjectMembersList } from "@/components/project/ProjectMembersList";
import { GridPattern, NoiseTexture, FloatingShape } from "@/components/ui/DecorativeElements";

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
      hubTasks: { where: { isGlobal: true }, select: { id: true, status: true } },
    },
  });

  if (!project) redirect("/explore");

  const isMember = project.members.some((m) => m.userId === session?.user?.id);
  const isOwner = project.ownerId === session?.user?.id;
  const cat = CATEGORY_META[project.category];
  const commit = COMMITMENT_META[project.commitmentLevel];
  const topic = TOPIC_META[project.projectTopic];

  const totalTasks = project.hubTasks.length;
  const doneTasks = project.hubTasks.filter((t) => t.status === "DONE").length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const spotsLeft = project.maxMembers - project.members.length;

  const TRUST_EMOJI: Record<string, string> = { NEWCOMER: "🔴", MEMBER: "🟡", TRUSTED: "🟢", VERIFIED: "🔵" };

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)", position: "relative", overflow: "hidden" }}>
      <div className="mobile-only-decor">
        <NoiseTexture />
        <GridPattern />
        <FloatingShape type="circle" color="#FFE500" size={120} top="10%" right="2%" delay={0} />
        <FloatingShape type="square" color="#FF4D4D" size={80} bottom="5%" left="2%" delay={0.5} />
      </div>
      
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        {/* Back */}
        <Link href="/explore" style={{ color: "#0047FF", fontWeight: 700, textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "24px" }}>
          ← Kembali ke Explore
        </Link>

        <div className="project-detail-grid">
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Main card */}
            <div className="project-detail-main-card" style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", boxShadow: "6px 6px 0px #000", padding: "32px" }}>
              {/* Badges */}
              <div className="project-detail-badges" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                <span style={{ background: cat.color, border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {cat.emoji} {cat.label}
                </span>
                <span style={{ background: project.commitmentLevel === "KOMPETISI" ? "#FF4D4D" : project.commitmentLevel === "SERIUS" ? "#0047FF" : "#00D37F", color: project.commitmentLevel === "CASUAL" ? "#000" : "#fff", border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {commit.label}
                </span>
                <span style={{ background: topic.color, color: "#fff", border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {topic.label}
                </span>
                <span style={{ background: project.status === "OPEN" ? "#00D37F" : "#FF4D4D", color: project.status === "OPEN" ? "#000" : "#fff", border: "2px solid #000", borderRadius: "4px", padding: "4px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
                  {project.status === "OPEN" ? "● Open" : project.status}
                </span>
              </div>

              <h1 className="project-detail-title" style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(24px, 4vw, 36px)", marginBottom: "16px" }}>
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
              <ProjectMembersList 
                initialMembers={JSON.parse(JSON.stringify(project.members))} 
                projectId={id}
                currentUserId={session?.user?.id}
                isOwner={isOwner}
                isAdmin={project.members.find(m => m.userId === session?.user?.id)?.role === "ADMIN"}
              />
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
                  <div 
                    title={`${getTrustLevelLabel(project.owner.trustLevel)}: ${project.owner.trustScore} pts`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#F5F0E8",
                      border: "1.5px solid #000",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      boxShadow: "1.5px 1.5px 0px #000",
                      cursor: "help"
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{getTrustLevelEmoji(project.owner.trustLevel)}</span>
                    <span style={{ 
                      fontFamily: "Space Grotesk, sans-serif", 
                      fontWeight: 800, 
                      fontSize: "11px",
                      color: "#000"
                    }}>
                      {project.owner.trustScore}
                    </span>
                  </div>
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
                  <span style={{ color: "#3D3D3D" }}>Topik</span>
                  <span style={{ fontWeight: 700, color: topic.color }}>{topic.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
