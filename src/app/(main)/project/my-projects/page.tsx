import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/explore/ExploreClient";
import { LinkButton } from "@/components/ui/Button";
import { redirect } from "next/navigation";
import { GridPattern, FloatingShape, NoiseTexture, SectionLabel, containerVariants, itemVariants } from "@/components/ui/DecorativeElements";
import * as motion from "framer-motion/client";

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
        <FloatingShape type="square" color="#0047FF" size={140} top="-30px" left="5%" delay={0} />
        <FloatingShape type="circle" color="#FFE500" size={100} bottom="-20px" right="8%" delay={0.4} />
        <FloatingShape type="triangle" color="#FF4D4D" size={70} top="50px" right="15%" delay={0.8} />
        <FloatingShape type="circle" color="#00D37F" size={50} bottom="40px" left="15%" delay={1.2} />
        
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "32px" }}>
            <div style={{ flex: "1", minWidth: "300px" }}>
              <SectionLabel>🚀 MISSION CONTROL</SectionLabel>
              <h1 style={{ 
                fontFamily: "Space Grotesk, sans-serif", 
                fontWeight: 900, 
                fontSize: "clamp(48px, 8vw, 72px)", 
                margin: "16px 0 12px", 
                lineHeight: 0.9,
                letterSpacing: "-2px"
              }}>
                Project <br />
                <span style={{ color: "#0047FF", WebkitTextStroke: "2px black" }}>Kamu</span>
              </h1>
              <p style={{ 
                color: "#3D3D3D", 
                fontSize: "20px", 
                margin: 0, 
                fontWeight: 600,
                maxWidth: "500px",
                lineHeight: 1.4
              }}>
                {projects.length > 0 
                  ? `Kamu sedang berkolaborasi di ${projects.length} project hebat.`
                  : "Siap untuk mulai perjalanan kolaborasimu?"}
              </p>
            </div>
            
            <div style={{ paddingBottom: "10px" }}>
              <LinkButton href="/project/create" variant="primary" size="lg" id="my-projects-create-btn" style={{ fontSize: "20px", padding: "16px 32px" }}>
                + Buat Project Baru
              </LinkButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px", position: "relative", zIndex: 1 }}>
        {projects.length === 0 ? (
          <div style={{ position: "relative" }}>
             {/* Background shapes for empty state */}
             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: "120%", zIndex: -1, opacity: 0.5, pointerEvents: "none" }}>
                <FloatingShape type="circle" color="#FFE500" size={300} top="0" left="0" delay={0.1} />
                <FloatingShape type="square" color="#00D37F" size={200} bottom="0" right="0" delay={0.5} />
             </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                style={{
                textAlign: "center",
                padding: "100px 48px",
                background: "#fff",
                border: "4px solid #000",
                borderRadius: "24px",
                boxShadow: "20px 20px 0px #000",
                }}
            >
                <motion.div 
                animate={{ 
                    rotate: [0, 10, -10, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ fontSize: "120px", marginBottom: "40px", display: "inline-block", filter: "drop-shadow(8px 8px 0px rgba(0,0,0,0.1))" }}
                >
                🌵
                </motion.div>
                <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "42px", marginBottom: "20px", letterSpacing: "-1px" }}>
                Hening Sekali di Sini...
                </h2>
                <p style={{ color: "#3D3D3D", fontSize: "22px", maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.5, fontWeight: 600 }}>
                Kamu belum memulai atau bergabung dalam project apapun. Jangan biarkan skill hebatmu menganggur!
                </p>
                <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
                <LinkButton href="/explore" variant="secondary" size="lg" style={{ minWidth: "240px", fontSize: "18px" }}>
                    🔍 Jelajahi Project
                </LinkButton>
                <LinkButton href="/project/create" variant="primary" size="lg" style={{ minWidth: "240px", fontSize: "18px" }}>
                    🚀 Mulai Project Pertama
                </LinkButton>
                </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px" }}
          >
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} userSkills={userSkills} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
