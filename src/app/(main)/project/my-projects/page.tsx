import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/explore/ExploreClient";
import { LinkButton } from "@/components/ui/Button";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Projects",
  description: "Kelola dan pantau semua project yang kamu ikuti di CollaboLab.",
};

async function getUserProjects(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        requiredSkills: { select: { skillName: true } },
        members: { select: { id: true } },
        owner: { 
          select: { 
            id: true, 
            name: true, 
            image: true, 
            trustScore: true, 
            trustLevel: true,
            externalLinks: {
                select: {
                    platform: true,
                    url: true
                }
            }
          } 
        },
      },
    });
    return projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      deadline: p.deadline ? p.deadline.toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
}

export default async function MyProjectsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch projects
  const projects = await getUserProjects(userId);

  // Fetch user skills for match indicator
  const userWithSkills = await prisma.user.findUnique({
    where: { id: userId },
    select: { skills: { select: { skillName: true } } },
  });
  const userSkills = userWithSkills?.skills.map((s) => s.skillName) ?? [];

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "3px solid #000", padding: "48px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <span className="section-label">🚀 MY PROJECTS</span>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 48px)", margin: "12px 0 8px", lineHeight: 1 }}>
              Project-mu
            </h1>
            <p style={{ color: "#3D3D3D", fontSize: "18px", margin: 0, fontWeight: 500 }}>
              {projects.length > 0 
                ? `Kamu tergabung dalam ${projects.length} project aktif.`
                : "Kamu belum bergabung dalam project apapun."}
            </p>
          </div>
          <LinkButton href="/project/create" variant="primary" size="lg" id="my-projects-create-btn">
            + Buat Project
          </LinkButton>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 32px",
              background: "#fff",
              border: "3px dashed #000",
              borderRadius: "12px",
              boxShadow: "8px 8px 0px #000",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🌵</div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "12px" }}>
              Wah, masih sepi nih!
            </h2>
            <p style={{ color: "#3D3D3D", fontSize: "16px", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.6 }}>
              Sepertinya kamu belum memulai atau bergabung dalam project apapun. Ayo mulai kolaborasi sekarang!
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <LinkButton href="/explore" variant="secondary">
                🔍 Jelajahi Project
              </LinkButton>
              <LinkButton href="/project/create" variant="primary">
                🚀 Buat Project Baru
              </LinkButton>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px" }}>
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} userSkills={userSkills} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
