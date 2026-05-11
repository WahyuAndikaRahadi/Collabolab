import { prisma } from "@/lib/prisma";
import { NoiseTexture, SectionLabel } from "@/components/ui/DecorativeElements";

async function getStats() {
  try {
    // Using raw queries to bypass any potential stale Prisma client issues in Turbopack
    const userCountRes = await prisma.$queryRawUnsafe<any[]>(`SELECT count(*)::INT as count FROM "User"`);
    const projectCountRes = await prisma.$queryRawUnsafe<any[]>(`SELECT count(*)::INT as count FROM "Project"`);
    const reportCountRes = await prisma.$queryRawUnsafe<any[]>(`SELECT count(*)::INT as count FROM "Report"`);
    
    const recentUsers = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, email, "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 5`
    );
    
    const recentProjects = await prisma.$queryRawUnsafe<any[]>(
      `SELECT p.id, p.title, p.category, u.name as "ownerName" 
       FROM "Project" p 
       JOIN "User" u ON p."ownerId" = u.id 
       ORDER BY p."createdAt" DESC LIMIT 5`
    );

    return {
      userCount: userCountRes[0]?.count || 0,
      projectCount: projectCountRes[0]?.count || 0,
      reportCount: reportCountRes[0]?.count || 0,
      recentUsers: recentUsers || [],
      recentProjects: recentProjects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        owner: { name: p.ownerName }
      }))
    };
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return {
      userCount: 0,
      projectCount: 0,
      reportCount: 0,
      recentUsers: [],
      recentProjects: []
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "40px" }}>
        <div style={{ display: "inline-block", background: "#000", color: "#FFE500", padding: "4px 12px", borderRadius: "2px", fontWeight: 900, fontSize: "12px", marginBottom: "16px", border: "2px solid #000" }}>
           ADMIN_SESSION_ACTIVE
        </div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "48px", margin: "0 0 12px 0", color: "#000" }}>
          Command Center
        </h1>
        <p style={{ color: "#3D3D3D", fontSize: "18px", fontWeight: 600 }}>
          Monitoring global ecosystem health and user activity.
        </p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", padding: "32px", position: "relative", overflow: "hidden", boxShadow: "8px 8px 0px #000" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#666", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Total Users</div>
          <div style={{ fontSize: "48px", fontWeight: 900, color: "#000" }}>{stats.userCount}</div>
          <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "12px", color: "#00D37F" }}>↑ 12% from last week</div>
          <div style={{ position: "absolute", bottom: "-10px", right: "-10px", fontSize: "60px", opacity: 0.1 }}>👥</div>
        </div>
        
        <div style={{ background: "#FFE500", border: "3px solid #000", borderRadius: "8px", padding: "32px", position: "relative", overflow: "hidden", boxShadow: "8px 8px 0px #000" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#000", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Active Projects</div>
          <div style={{ fontSize: "48px", fontWeight: 900, color: "#000" }}>{stats.projectCount}</div>
          <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "12px", color: "#000" }}>Stable activity</div>
          <div style={{ position: "absolute", bottom: "-10px", right: "-10px", fontSize: "60px", opacity: 0.1 }}>📁</div>
        </div>

        <div style={{ background: "#fff", border: "3px solid #FF4D4D", borderRadius: "8px", padding: "32px", position: "relative", overflow: "hidden", boxShadow: "8px 8px 0px #FF4D4D" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#FF4D4D", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Pending Reports</div>
          <div style={{ fontSize: "48px", fontWeight: 900, color: "#FF4D4D" }}>{stats.reportCount}</div>
          <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "12px", color: "#FF4D4D" }}>Requires Attention</div>
          <div style={{ position: "absolute", bottom: "-10px", right: "-10px", fontSize: "60px", opacity: 0.1 }}>🚩</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        {/* Recent Users */}
        <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", padding: "32px", boxShadow: "8px 8px 0px #000" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px", marginBottom: "24px", color: "#000", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#FFE500", textShadow: "1px 1px 0px #000" }}>{">"}</span> Recent Registrations
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stats.recentUsers.map(user => (
              <div key={user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "2px solid #f0f0f0" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#000" }}>{user.name}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{user.email}</div>
                </div>
                <div style={{ fontSize: "10px", fontWeight: 800, background: "#f0f0f0", color: "#000", padding: "4px 8px", borderRadius: "2px", border: "1px solid #000" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", padding: "32px", boxShadow: "8px 8px 0px #000" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px", marginBottom: "24px", color: "#000", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#FFE500", textShadow: "1px 1px 0px #000" }}>{">"}</span> Latest Projects
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stats.recentProjects.map(project => (
              <div key={project.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "2px solid #f0f0f0" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#000" }}>{project.title}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>owner: {project.owner.name}</div>
                </div>
                <div style={{ fontSize: "10px", fontWeight: 800, background: "#FFE500", color: "#000", padding: "4px 8px", borderRadius: "2px", border: "1px solid #000" }}>
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
