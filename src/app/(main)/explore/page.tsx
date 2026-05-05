import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ExploreClient } from "@/components/explore/ExploreClient";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Explore Project",
  description: "Temukan project kolaborasi yang cocok dengan skill kamu di CollaboLab.",
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getInitialProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "OPEN" },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        requiredSkills: { select: { skillName: true } },
        members: { select: { id: true } },
        owner: { select: { id: true, name: true, image: true, trustScore: true, trustLevel: true } },
      },
    });
    return projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      deadline: p.deadline ? p.deadline.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function ExplorePage() {
  const initialProjects = await getInitialProjects();

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "3px solid #000", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="section-label">🔍 EXPLORE</span>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 40px)", margin: "8px 0 4px" }}>
              Temukan Project-mu
            </h1>
            <p style={{ color: "#3D3D3D", fontSize: "16px", margin: 0 }}>
              {initialProjects.length}+ project aktif menunggu kolaboratormu
            </p>
          </div>
          <LinkButton href="/project/create" variant="primary" id="explore-create-project-btn">
            + Buat Project
          </LinkButton>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <ExploreClient initialProjects={initialProjects as Parameters<typeof ExploreClient>[0]["initialProjects"]} />
      </div>
    </div>
  );
}
