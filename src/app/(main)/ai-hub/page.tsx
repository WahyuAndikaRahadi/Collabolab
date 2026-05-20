
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AIHubPage } from "@/components/ai-hub/AIHubPage";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { trustScore: true, trustLevel: true }
  });

  if (!user) redirect("/login");

  const usages = await prisma.aIToolUsage.findMany({
    where: { userId: session.user.id },
    orderBy: { usedAt: "desc" },
    distinct: ["toolType"]
  });

  return (
    <main className="min-h-screen">
      <AIHubPage 
        trustScore={user.trustScore} 
        trustLevel={user.trustLevel} 
        currentUsages={usages.map(u => ({
          toolType: u.toolType,
          expiresAt: u.expiresAt.toISOString()
        }))} 
      />
    </main>
  );
}
