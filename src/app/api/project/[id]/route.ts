import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, description } = updateSchema.parse(body);

    // Check if user is OWNER or ADMIN of the project
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: session.user.id,
        },
      },
    });

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("[PROJECT_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
