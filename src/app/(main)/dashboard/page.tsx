import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import { CATEGORY_META } from "@/types";
import type { ProjectCategory, TrustLevel } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard CollaboLab — lihat project aktif, notifikasi, dan aktivitas terbarumu.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      skills: { select: { skillName: true } },
      memberships: {
        include: {
          project: {
            include: {
              requiredSkills: { select: { skillName: true } },
              members: { select: { id: true } },
              owner: { select: { id: true, name: true, trustScore: true, trustLevel: true } },
            },
          },
        },
        take: 6,
        orderBy: { joinedAt: "desc" },
      },
      bookmarks: {
        include: {
          project: {
            include: {
              requiredSkills: { select: { skillName: true } },
              owner: { select: { id: true, name: true, trustScore: true, trustLevel: true } },
            },
          },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const myProjects = user.memberships.filter((m) => m.role === "OWNER");
  const joinedProjects = user.memberships.filter((m) => m.role === "MEMBER");

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "3px solid #000", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(24px, 4vw, 36px)", margin: "0 0 8px" }}>
              Hei, {user.name?.split(" ")[0]}! 👋
            </h1>
            <p style={{ color: "#3D3D3D", fontSize: "16px", margin: 0 }}>
              Siap kolaborasi hari ini?
            </p>
            <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {user.skills.slice(0, 5).map((s) => (
                <span key={s.skillName} className="skill-chip" style={{ cursor: "default" }}>{s.skillName}</span>
              ))}
            </div>
          </div>

          <TrustScoreBadge
            score={user.trustScore}
            level={user.trustLevel}
            variant="full"
          />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", display: "grid", gap: "32px" }}>
        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          { [
            { href: "/project/create", label: "+ Buat Project", color: "#FFE500", emoji: "🚀" },
            { href: "/explore", label: "Explore Project", color: "#00D37F", emoji: "🔍" },
            { href: `/profile/${user.id}`, label: "Lihat Profil", color: "#F5F0E8", emoji: "👤" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              id={`dashboard-quick-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="nb-card"
              style={{
                background: action.color,
                padding: "20px",
                textDecoration: "none",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{action.emoji}</span>
              {action.label}
            </Link>
          ))}
        </div>

        {/* My Projects */}
        <div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", marginBottom: "16px" }}>
            📋 Project Saya
          </h2>
          {myProjects.length === 0 ? (
            <div className="nb-card" style={{ padding: "32px", textAlign: "center" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", margin: "0 0 12px" }}>
                Belum ada project yang kamu buat.
              </p>
              <Link href="/project/create" className="btn-primary btn-sm" id="dashboard-create-first-project">
                Buat Project Pertama →
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {myProjects.map((m) => {
                const cat = CATEGORY_META[m.project.category as ProjectCategory];
                return (
                  <div
                    key={m.project.id}
                    id={`dashboard-my-project-${m.project.id}`}
                    className="nb-card"
                    style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="badge" style={{ background: cat.color, color: "#000" }}>
                        {cat.emoji} {cat.label}
                      </span>
                      <span className="badge badge-green">
                        {m.project.status}
                      </span>
                    </div>
                    
                    <Link 
                      href={`/project/${m.project.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "17px", margin: 0 }}>
                        {m.project.title}
                      </h3>
                    </Link>

                    <p style={{ fontSize: "13px", color: "#3D3D3D", margin: 0 }}>
                      {m.project.members.length}/{m.project.maxMembers} anggota
                    </p>

                    <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                      <Link
                        href={`/project/${m.project.id}/room`}
                        className="btn-primary btn-sm"
                        style={{ flex: 1, textAlign: "center" }}
                        id={`dashboard-open-room-${m.project.id}`}
                      >
                        🏠 Collab Room
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Joined Projects */}
        {joinedProjects.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", marginBottom: "16px" }}>
              🤝 Project yang Kamu Ikuti
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {joinedProjects.map((m) => {
                const cat = CATEGORY_META[m.project.category as ProjectCategory];
                return (
                  <div key={m.project.id} style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0px #000", padding: "20px" }}>
                    <span style={{ background: cat.color, border: "1.5px solid #000", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", display: "inline-block", marginBottom: "8px" }}>
                      {cat.emoji} {cat.label}
                    </span>
                    <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "16px", margin: "0 0 12px" }}>
                      {m.project.title}
                    </h3>
                    <Link href={`/project/${m.project.id}/room`} className="btn-primary btn-sm" id={`dashboard-joined-room-${m.project.id}`}>
                      🏠 Masuk Room
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
