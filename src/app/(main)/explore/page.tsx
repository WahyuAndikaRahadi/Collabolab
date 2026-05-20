import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExploreClient } from "@/components/explore/ExploreClient";
import { LinkButton } from "@/components/ui/Button";
import { GridPattern, FloatingShape, NoiseTexture, SectionLabel } from "@/components/ui/DecorativeElements";

export const metadata: Metadata = {
  title: "Explore Project",
  description: "Temukan project kolaborasi yang cocok dengan skill kamu di CollaboLab.",
};

export const revalidate = 60;

async function getInitialProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "OPEN" },
      take: 48,
      orderBy: { createdAt: "desc" },
      include: {
        requiredSkills: { select: { skillName: true } },
        members: { select: { id: true } },
        hubTasks: { where: { isGlobal: true }, select: { id: true, status: true } },
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
  const session = await auth();

  let userSkills: string[] = [];
  if (session?.user?.id) {
    const userWithSkills = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { skills: { select: { skillName: true } } },
    });
    userSkills = userWithSkills?.skills.map((s) => s.skillName) ?? [];
  }

  const initialProjects = await getInitialProjects();

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)", position: "relative", overflow: "hidden" }}>
      <NoiseTexture />
      
      {/* Header */}
      <div style={{ 
        background: "#fff", 
        borderBottom: "4px solid #000", 
        padding: "80px 24px", 
        position: "relative", 
        overflow: "hidden",
        boxShadow: "0 8px 0px rgba(0,0,0,0.05)"
      }}>
        <GridPattern />
        
        {/* Decorative Shapes */}
        <FloatingShape type="circle" color="#FFE500" size={180} top="-40px" right="5%" delay={0} />
        <FloatingShape type="triangle" color="#00D37F" size={120} bottom="-20px" left="2%" delay={0.4} />
        <FloatingShape type="square" color="#FF4D4D" size={60} top="40px" left="15%" delay={0.8} />
        <FloatingShape type="circle" color="#0047FF" size={90} bottom="40px" right="15%" delay={1.2} />
        
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "32px" }}>
            <div style={{ flex: "1", minWidth: "300px" }}>
              <SectionLabel>🔍 EXPLORE THE UNIVERSE</SectionLabel>
              <h1 style={{ 
                fontFamily: "Space Grotesk, sans-serif", 
                fontWeight: 900, 
                fontSize: "clamp(48px, 8vw, 72px)", 
                margin: "16px 0 12px", 
                lineHeight: 0.9,
                letterSpacing: "-2px"
              }}>
                Temukan <br /> 
                <span style={{ color: "#FFE500", WebkitTextStroke: "2px black" }}>Project-mu</span>
              </h1>
              <p style={{ 
                color: "#3D3D3D", 
                fontSize: "20px", 
                margin: 0, 
                fontWeight: 600,
                maxWidth: "500px",
                lineHeight: 1.4
              }}>
                Mulai kolaborasi nyata dengan {initialProjects.length}+ project aktif yang siap dikerjakan bersama.
              </p>
            </div>
            
            <div style={{ paddingBottom: "10px" }}>
              <LinkButton href="/project/create" variant="primary" size="lg" id="explore-create-project-btn" style={{ fontSize: "20px", padding: "16px 32px" }}>
                🚀 Buat Project Baru
              </LinkButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <ExploreClient initialProjects={initialProjects as Parameters<typeof ExploreClient>[0]["initialProjects"]} userSkills={userSkills} />
      </div>
    </div>
  );
}
