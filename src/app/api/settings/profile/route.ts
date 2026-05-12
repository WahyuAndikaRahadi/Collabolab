import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, image } = body;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(image && { image }),
      },
    });

    return NextResponse.json({ 
      message: "Profil berhasil diperbarui", 
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        image: updatedUser.image
      } 
    });
  } catch (err) {
    console.error("[profile-update]", err);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
