import { prisma } from "@/lib/prisma";
import { NoiseTexture, SectionLabel } from "@/components/ui/DecorativeElements";

async function getStats() {
  const [userCount, projectCount, reportCount, recentUsers, recentProjects] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.report.count(),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, createdAt: true, email: true } }),
    prisma.project.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { owner: { select: { name: true } } } }),
  ]);

  return { userCount, projectCount, reportCount, recentUsers, recentProjects };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "40px" }}>
        <SectionLabel>🛡️ COMMAND CENTER</SectionLabel>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "48px", margin: "12px 0" }}>
          Admin Overview
        </h1>
        <p style={{ color: "#3D3D3D", fontSize: "18px", fontWeight: 600 }}>
          Pantau pertumbuhan dan kesehatan ekosistem CollaboLab.
        </p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        <div style={{ background: "#FFE500", border: "3px solid #000", borderRadius: "12px", padding: "32px", boxShadow: "8px 8px 0px #000" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>Total Users</div>
          <div style={{ fontSize: "48px", fontWeight: 900 }}>{stats.userCount}</div>
          <div style={{ fontSize: "14px", fontWeight: 700, marginTop: "8px" }}>+5 dalam 24 jam</div>
        </div>
        <div style={{ background: "#00D37F", border: "3px solid #000", borderRadius: "12px", padding: "32px", boxShadow: "8px 8px 0px #000" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>Active Projects</div>
          <div style={{ fontSize: "48px", fontWeight: 900 }}>{stats.projectCount}</div>
          <div style={{ fontSize: "14px", fontWeight: 700, marginTop: "8px" }}>Semua kategori</div>
        </div>
        <div style={{ background: "#FF4D4D", border: "3px solid #000", borderRadius: "12px", padding: "32px", boxShadow: "8px 8px 0px #000", color: "#fff" }}>
          <div style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>Pending Reports</div>
          <div style={{ fontSize: "48px", fontWeight: 900 }}>{stats.reportCount}</div>
          <div style={{ fontSize: "14px", fontWeight: 700, marginTop: "8px" }}>Butuh tindakan segera</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        {/* Recent Users */}
        <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "12px", padding: "32px", boxShadow: "6px 6px 0px #000" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "24px" }}>
            User Baru
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stats.recentUsers.map(user => (
              <div key={user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #eee" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{user.name}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{user.email}</div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, background: "#F5F0E8", padding: "4px 8px", borderRadius: "4px", border: "1px solid #000" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "12px", padding: "32px", boxShadow: "6px 6px 0px #000" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "24px" }}>
            Project Terbaru
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stats.recentProjects.map(project => (
              <div key={project.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #eee" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{project.title}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>by {project.owner.name}</div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, background: "#FFE500", padding: "4px 8px", borderRadius: "4px", border: "1px solid #000" }}>
                  {project.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
