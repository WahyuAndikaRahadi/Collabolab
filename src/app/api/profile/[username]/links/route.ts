
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { LinkVisibility } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username: identifier } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  try {
    let user = await prisma.user.findUnique({
      where: { id: identifier },
      select: { id: true },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { username: identifier },
        select: { id: true },
      });
    }

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const visibilities: LinkVisibility[] = [LinkVisibility.PUBLIC];
    
    if (currentUserId) {
      visibilities.push(LinkVisibility.MEMBERS_ONLY);
      
      const areCollaborators = await prisma.projectMember.findFirst({
        where: {
          userId: currentUserId,
          project: {
            members: {
              some: { userId: user.id }
            }
          }
        }
      });
      
      if (areCollaborators) {
        visibilities.push(LinkVisibility.COLLABORATORS_ONLY);
      }
      
      if (currentUserId === user.id) {
        visibilities.push(LinkVisibility.COLLABORATORS_ONLY);
      }
    }

    const links = await prisma.externalLink.findMany({
      where: {
        userId: user.id,
        visibility: { in: visibilities },
        status: "VERIFIED",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("GET /api/profile/[username]/links error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}
