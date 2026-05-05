import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
  return { title: user ? `${user.name} | Profil` : "Profil Tidak Ditemukan" };
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      skills: true,
      endorsementsReceived: true,
      reviewsReceived: true,
      memberships: {
        where: { project: { status: "COMPLETED" } },
        include: { project: { select: { id: true, title: true, category: true } } },
      },
    },
  });

  if (!user) notFound();

  // Aggregate endorsements
  const endorsementsCount = user.endorsementsReceived.reduce((acc, curr) => {
    acc[curr.skillName] = (acc[curr.skillName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ background: "#F5F0E8", minHeight: "calc(100vh - 64px)", padding: "32px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Profile Card */}
        <div style={{ background: "#fff", border: "3px solid #000", borderRadius: "8px", boxShadow: "6px 6px 0px #000", padding: "32px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "3px solid #000", background: "#FFE500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: 900, flexShrink: 0 }}>
            {user.name[0]}
          </div>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", margin: "0 0 8px" }}>
              {user.name}
            </h1>
            <div style={{ marginBottom: "16px" }}>
              <TrustScoreBadge score={user.trustScore} level={user.trustLevel} variant="full" />
            </div>
            {user.bio && (
              <p style={{ color: "#3D3D3D", fontSize: "15px", lineHeight: 1.6, margin: "0 0 16px" }}>
                {user.bio}
              </p>
            )}
            
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {user.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0047FF", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  🔗 LinkedIn
                </a>
              )}
              {user.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0047FF", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  🔗 GitHub
                </a>
              )}
              {user.portfolioUrl && (
                <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0047FF", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  🔗 Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Endorsements */}
        <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0px #000", padding: "24px" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", marginBottom: "16px" }}>
            💡 Skills & Endorsements
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {user.skills.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "stretch", border: "2px solid #000", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ background: "#F5F0E8", padding: "6px 12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px" }}>
                  {s.skillName}
                </div>
                {endorsementsCount[s.skillName] > 0 && (
                  <div style={{ background: "#FFE500", padding: "6px 10px", fontWeight: 800, fontSize: "14px", borderLeft: "2px solid #000" }}>
                    ×{endorsementsCount[s.skillName]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completed Projects */}
        <div style={{ background: "#fff", border: "2px solid #000", borderRadius: "8px", boxShadow: "4px 4px 0px #000", padding: "24px" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", marginBottom: "16px" }}>
            🏆 Project Selesai ({user.memberships.length})
          </h2>
          {user.memberships.length === 0 ? (
            <p style={{ color: "#3D3D3D", fontSize: "14px" }}>Belum ada project yang diselesaikan.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {user.memberships.map(m => (
                <li key={m.id} style={{ padding: "12px", background: "#F5F0E8", border: "1.5px solid #000", borderRadius: "6px" }}>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px" }}>{m.project.title}</div>
                  <div style={{ fontSize: "12px", color: "#555" }}>Kategori: {m.project.category}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
