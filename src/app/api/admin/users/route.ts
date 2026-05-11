import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Middleware check for admin is handled in the route or a wrapper
async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    // Using raw query to bypass any stale Prisma client issues
    const users = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, email, "trustScore", "trustLevel", role, "isBlocked", "createdAt" 
       FROM "User" 
       ORDER BY "createdAt" DESC`
    );
    return NextResponse.json(users || []);
  } catch (err) {
    console.error("Admin user list fetch error:", err);
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { userId, trustScore, isBlocked, role } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(trustScore !== undefined && { trustScore: parseInt(trustScore) }),
        ...(isBlocked !== undefined && { isBlocked }),
        ...(role !== undefined && { role }),
      }
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengupdate user" }, { status: 500 });
  }
}
