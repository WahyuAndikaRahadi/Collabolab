import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getTrustLevelEmoji, getTrustLevelColor, getTrustLevelLabel } from "@/lib/trust-score";
import { CATEGORY_META, AVAIL_META } from "@/types";
import type { ProjectCategory } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard — CollaboLab",
  description: "Dashboard CollaboLab — lihat project aktif, statistik, dan aktivitas terbarumu.",
};

export default async function DashboardHub() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [user, recentMessages, recentTasks] = await Promise.all([
    prisma.user.findUnique({
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
                hubTasks: { where: { isGlobal: true }, select: { id: true, status: true } },
              },
            },
          },
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
    }),
    prisma.$queryRawUnsafe<any[]>(
      `SELECT "createdAt" FROM "ChatMessage" WHERE "senderId" = $1 AND "createdAt" >= $2`,
      session.user.id,
      sevenDaysAgo
    ),
    prisma.$queryRawUnsafe<any[]>(
      `SELECT "completedAt" FROM "HubTask" WHERE "assigneeId" = $1 AND "status" = 'DONE' AND "completedAt" >= $2`,
      session.user.id,
      sevenDaysAgo
    ),
  ]);

  if (!user) redirect("/login");

  const dayLabels: string[] = [];
  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayKeys.push(d.toISOString().slice(0, 10));
    dayLabels.push(
      d.toLocaleDateString("id-ID", { weekday: "short" })
    );
  }
  const activityMap: Record<string, number> = {};
  dayKeys.forEach((k) => (activityMap[k] = 0));
  recentMessages.forEach((msg) => {
    const k = msg.createdAt.toISOString().slice(0, 10);
    if (k in activityMap) activityMap[k]++;
  });
  recentTasks.forEach((task) => {
    if (task.completedAt) {
      const k = task.completedAt.toISOString().slice(0, 10);
      if (k in activityMap) activityMap[k]++;
    }
  });
  const activityData = dayKeys.map((k) => activityMap[k]);
  const maxActivity = Math.max(...activityData, 1);
  const totalWeekContributions = activityData.reduce((s, v) => s + v, 0);

  const myProjects = user.memberships.filter((m) => m.role === "OWNER");
  const allMemberships = user.memberships;
  const activeProjects = allMemberships.filter(
    (m) => m.project.status === "OPEN" || m.project.status === "IN_PROGRESS"
  );
  const recentActivity = allMemberships.slice(0, 3);

  const totalProjects = allMemberships.length;
  const totalContributions = allMemberships.reduce((sum, m) => {
    const doneTasks = m.project.hubTasks.filter((t) => t.status === "DONE").length;
    return sum + doneTasks;
  }, 0);
  const ownedCount = myProjects.length;
  const activeCount = activeProjects.length;

  const availMeta = AVAIL_META[user.availStatus];

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Selamat pagi" : greetingHour < 17 ? "Selamat siang" : "Selamat malam";

  const stats = [
    { label: "Total Project", value: totalProjects, emoji: "📁", color: "#FFE500" },
    { label: "Project Aktif", value: activeCount, emoji: "🔥", color: "#FF4D4D" },
    { label: "Project Dimiliki", value: ownedCount, emoji: "👑", color: "#0047FF" },
    { label: "Kontribusi Selesai", value: totalContributions, emoji: "✅", color: "#00D37F" },
  ];

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)" }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "3px solid #000",
          padding: "36px 24px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative dots */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "220px",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />
        {/* Yellow accent stripe */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "8px",
            height: "100%",
            background: "#FFE500",
            borderRight: "2px solid #000",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            paddingLeft: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#3D3D3D",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              {greeting}, 
            </p>
            <h1
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(26px, 4vw, 40px)",
                margin: "0 0 10px",
                lineHeight: 1.1,
              }}
            >
              {user.name?.split(" ")[0]}! 👋
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {/* Availability status pill */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: availMeta.color,
                  border: "2px solid #000",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  boxShadow: "2px 2px 0px #000",
                }}
              >
                {availMeta.emoji} {availMeta.label}
              </span>
              {user.isStudentVerified && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#0047FF",
                    color: "#fff",
                    border: "2px solid #000",
                    borderRadius: "20px",
                    padding: "4px 14px",
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    boxShadow: "2px 2px 0px #000",
                  }}
                >
                  🎓 Verified Student
                </span>
              )}
            </div>
            <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {user.skills.slice(0, 5).map((s) => (
                <span key={s.skillName} className="skill-chip" style={{ cursor: "default" }}>
                  {s.skillName}
                </span>
              ))}
              {user.skills.length > 5 && (
                <span className="skill-chip" style={{ cursor: "default", opacity: 0.6 }}>
                  +{user.skills.length - 5} lagi
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              background: "#F5F0E8",
              border: "3px solid #000",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "6px 6px 0px #000",
              minWidth: "280px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative background shape */}
            <div 
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                width: "60px",
                height: "60px",
                background: getTrustLevelColor(user.trustLevel),
                opacity: 0.1,
                borderRadius: "50%",
                zIndex: 0
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#3D3D3D", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Trust Score
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <span 
                      style={{ 
                        background: getTrustLevelColor(user.trustLevel), 
                        border: "2px solid #000",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: user.trustLevel === "MEMBER" ? "#000" : user.trustLevel === "NEWCOMER" ? "#fff" : "#000"
                      }}
                    >
                      {getTrustLevelEmoji(user.trustLevel)} {getTrustLevelLabel(user.trustLevel)}
                    </span>
                  </div>
                </div>
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "42px", lineHeight: 1 }}>
                  {user.trustScore}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  background: "#fff",
                  border: "2px solid #000",
                  borderRadius: "6px",
                  height: "16px",
                  overflow: "hidden",
                  marginBottom: "12px",
                  boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.1)"
                }}
              >
                <div
                  style={{
                    width: `${user.trustScore}%`,
                    height: "100%",
                    background: getTrustLevelColor(user.trustLevel),
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#3D3D3D", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  {user.trustScore < 31 ? `${31 - user.trustScore} poin lagi ke Member` : 
                   user.trustScore < 61 ? `${61 - user.trustScore} poin lagi ke Trusted` : 
                   user.trustScore < 86 ? `${86 - user.trustScore} poin lagi ke Verified` : 
                   "Level Maksimal! 🎉"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", display: "grid", gap: "36px" }}>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <div>
          <p className="section-label">📊 Statistik Kamu</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="nb-card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  background: "#fff",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Color accent top bar */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: stat.color,
                    borderBottom: "2px solid #000",
                  }}
                />
                <span style={{ fontSize: "28px", marginTop: "4px" }}>{stat.emoji}</span>
                <span
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: "38px",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#3D3D3D",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

                {/* ── 7-Day Activity Chart ──────────────────────────── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <p className="section-label">📈 Aktivitas 7 Hari Terakhir</p>
            <span
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#3D3D3D",
              }}
            >
              {totalWeekContributions} kontribusi minggu ini
            </span>
          </div>

          <div
            className="nb-card"
            style={{ padding: "24px 28px", background: "#fff", overflow: "hidden" }}
          >
            {/* Chart area */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(7, 1fr)`,
                gap: "10px",
                alignItems: "flex-end",
                height: "140px",
              }}
            >
              {activityData.map((count, idx) => {
                const heightPct = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
                const isToday = idx === 6;
                const barColor = isToday ? "#FFE500" : count > 0 ? "#000" : "#E8E3DB";
                const barBorder = count > 0 || isToday ? "2px solid #000" : "2px solid #ccc";

                return (
                  <div
                    key={dayKeys[idx]}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: "100%",
                      gap: "6px",
                    }}
                  >
                    {/* Value label on top */}
                    {count > 0 && (
                      <span
                        style={{
                          fontFamily: "Space Grotesk, sans-serif",
                          fontWeight: 800,
                          fontSize: "12px",
                          color: "#000",
                        }}
                      >
                        {count}
                      </span>
                    )}
                    {/* Bar */}
                    <div
                      title={`${count} kontribusi`}
                      style={{
                        width: "100%",
                        height: `${Math.max(heightPct, count === 0 ? 8 : 12)}%`,
                        background: barColor,
                        border: barBorder,
                        borderRadius: "4px 4px 0 0",
                        boxShadow: count > 0 ? "2px 2px 0px #000" : "none",
                        transition: "height 0.4s ease",
                        minHeight: "8px",
                      }}
                    />
                    {/* Day label */}
                    <span
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: isToday ? 800 : 600,
                        fontSize: "11px",
                        color: isToday ? "#000" : "#3D3D3D",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isToday ? "Hari ini" : dayLabels[idx]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "2px solid #000",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "14px", height: "14px", background: "#FFE500", border: "2px solid #000", borderRadius: "2px" }} />
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "12px", color: "#3D3D3D" }}>Hari ini</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "14px", height: "14px", background: "#000", border: "2px solid #000", borderRadius: "2px" }} />
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "12px", color: "#3D3D3D" }}>Ada kontribusi</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "14px", height: "14px", background: "#E8E3DB", border: "2px solid #ccc", borderRadius: "2px" }} />
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "12px", color: "#3D3D3D" }}>Tidak aktif</span>
              </div>
              <span style={{ marginLeft: "auto", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "12px", color: "#3D3D3D" }}>
                💬 chat + ✅ task
              </span>
            </div>
          </div>
        </div>


        {/* ── Recent Activity ───────────────────────────────── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p className="section-label">⚡ Aktivitas Terkini</p>
            <Link
              href="/project/my-projects"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#0047FF",
                textDecoration: "none",
                borderBottom: "2px solid #0047FF",
                paddingBottom: "1px",
              }}
            >
              Lihat Semua →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div
              className="nb-card"
              style={{
                padding: "48px 32px",
                textAlign: "center",
                background: "#fff",
                borderStyle: "dashed",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚀</div>
              <p
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                Belum ada aktivitas.
              </p>
              <p style={{ color: "#3D3D3D", fontSize: "14px", marginBottom: "20px" }}>
                Mulai dengan bergabung ke project atau buat sendiri!
              </p>
              <Link href="/explore" className="btn-primary btn-sm" id="dashboard-explore-cta">
                Jelajahi Project
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {recentActivity.map((m, idx) => {
                const cat = CATEGORY_META[m.project.category as ProjectCategory];
                const totalTasks = m.project.hubTasks.length;
                const doneTasks = m.project.hubTasks.filter((t) => t.status === "DONE").length;
                const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
                const isOwner = m.role === "OWNER";

                const accentColors = ["#FFE500", "#00D37F", "#0047FF"];
                const accentColor = accentColors[idx % accentColors.length];

                return (
                  <div
                    key={m.project.id}
                    id={`dashboard-recent-${m.project.id}`}
                    style={{
                      background: "#fff",
                      border: "2px solid #000",
                      borderRadius: "8px",
                      boxShadow: "5px 5px 0px #000",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      style={{
                        height: "6px",
                        background: accentColor,
                        borderBottom: "2px solid #000",
                      }}
                    />

                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
                      {/* Header row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span
                          className="badge"
                          style={{
                            background: cat.color,
                            color: "#000",
                            border: "1.5px solid #000",
                          }}
                        >
                          {cat.emoji} {cat.label}
                        </span>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          {isOwner && (
                            <span
                              style={{
                                background: "#000",
                                color: "#FFE500",
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700,
                                fontSize: "10px",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              👑 Owner
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "Space Grotesk, sans-serif",
                              fontWeight: 700,
                              color: m.project.status === "OPEN" ? "#00D37F" : m.project.status === "IN_PROGRESS" ? "#0047FF" : "#3D3D3D",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {m.project.status === "OPEN" ? "● Open" : m.project.status === "IN_PROGRESS" ? "● Active" : m.project.status}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link
                        href={`/project/${m.project.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <h3
                          style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 800,
                            fontSize: "17px",
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {m.project.title}
                        </h3>
                      </Link>

                      {/* Members */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#3D3D3D",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        <span>👥</span>
                        <span>
                          {m.project.members.length}/{m.project.maxMembers} anggota
                        </span>
                      </div>

                      {/* Progress bar */}
                      {totalTasks > 0 && (
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "6px",
                              fontSize: "12px",
                              fontFamily: "Space Grotesk, sans-serif",
                              fontWeight: 700,
                              color: "#3D3D3D",
                            }}
                          >
                            <span>Progress</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div
                            style={{
                              background: "#F5F0E8",
                              border: "2px solid #000",
                              borderRadius: "4px",
                              height: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${progressPct}%`,
                                height: "100%",
                                background: accentColor,
                                transition: "width 0.5s ease",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {m.project.requiredSkills.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {m.project.requiredSkills.slice(0, 3).map((sk) => (
                            <span
                              key={sk.skillName}
                              style={{
                                background: "#F5F0E8",
                                border: "1.5px solid #000",
                                borderRadius: "20px",
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: "11px",
                                fontWeight: 500,
                                padding: "2px 10px",
                              }}
                            >
                              {sk.skillName}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div style={{ marginTop: "auto", paddingTop: "4px" }}>
                        <Link
                          href={`/project/${m.project.id}/hub`}
                          className="btn-primary btn-sm"
                          style={{ width: "100%", textAlign: "center" }}
                          id={`dashboard-recent-hub-${m.project.id}`}
                        >
                          🤝 Masuk Collab Hub
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        

        {/* ── Empty state — no projects at all ─────────────── */}
        {allMemberships.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 32px",
              background: "#fff",
              border: "2px dashed #000",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🚀</div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "12px" }}>
              Mulai perjalananmu!
            </h2>
            <p style={{ color: "#3D3D3D", fontSize: "15px", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
              Kamu belum bergabung ke project manapun. Jelajahi ribuan project menarik dan temukan tim impianmu.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/explore" className="btn-primary" id="dashboard-empty-explore">
                🔍 Jelajahi Project
              </Link>
              <Link href="/project/create" className="btn-secondary" id="dashboard-empty-create">
                + Buat Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
