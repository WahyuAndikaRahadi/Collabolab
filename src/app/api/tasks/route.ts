import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";
import { z } from "zod";

const taskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assigneeId: z.string().nullable().optional(),
  labelTag: z.string().max(50).nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

    const member = await prisma.projectMember.findFirst({ where: { projectId: parsed.data.projectId, userId: session.user.id } });
    if (!member) return NextResponse.json({ error: "Kamu bukan anggota project ini." }, { status: 403 });

    const lastTask = await prisma.task.findFirst({ where: { projectId: parsed.data.projectId, status: "TODO" }, orderBy: { position: "desc" } });
    const position = (lastTask?.position ?? 0) + 1000;

    const { deadline, ...taskData } = parsed.data;
    const task = await prisma.task.create({
      data: { ...taskData, position, deadline: deadline ? new Date(deadline) : null },
    });

    await pusherServer.trigger(CHANNELS.project(parsed.data.projectId), EVENTS.TASK_CREATED, task);

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("[tasks POST]", err);
    return NextResponse.json({ error: "Gagal membuat task." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Task ID required." }, { status: 400 });

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "Task tidak ditemukan." }, { status: 404 });

    const member = await prisma.projectMember.findFirst({ where: { projectId: task.projectId, userId: session.user.id } });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await prisma.task.update({ where: { id }, data: updates });

    await pusherServer.trigger(CHANNELS.project(task.projectId), EVENTS.TASK_UPDATED, updated);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[tasks PATCH]", err);
    return NextResponse.json({ error: "Gagal mengupdate task." }, { status: 500 });
  }
}
