import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CollabRoomClient } from "@/components/room/CollabRoomClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { title: true } });
  return { title: project ? `${project.title} — Collab Room` : "Collab Room" };
}

export default async function CollabRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true, trustScore: true, trustLevel: true } } },
      },
      tasks: { orderBy: [{ status: "asc" }, { position: "asc" }] },
      polls: { include: { options: { include: { votes: true } } }, where: { isActive: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  if (!project) redirect("/explore");

  const isMember = project.members.some((m) => m.userId === session.user.id);
  if (!isMember) redirect(`/project/${id}`);

  const currentMember = project.members.find((m) => m.userId === session.user.id)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* Room header */}
      <div style={{ background: "#000", borderBottom: "3px solid #000", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href={`/project/${id}`} style={{ color: "#FFE500", textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px" }}>
            ← {project.title}
          </Link>
          <span style={{ background: "#FFE500", color: "#000", border: "1.5px solid #FFE500", borderRadius: "4px", padding: "2px 8px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "12px" }}>
            🏠 Collab Room
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {project.members.slice(0, 5).map((m) => (
            <div
              key={m.id}
              title={m.isAnonymous && !m.revealedAt ? `Anon#${m.anonymousTag || "0000"}` : m.user.name}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "2px solid #FFE500",
                background: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FFE500",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {m.isAnonymous && !m.revealedAt ? "👤" : m.user.name[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Main room */}
      <CollabRoomClient
        project={JSON.parse(JSON.stringify(project))}
        currentUserId={session.user.id}
        isOwner={project.owner.id === session.user.id}
        currentMember={JSON.parse(JSON.stringify(currentMember))}
      />
    </div>
  );
}
