
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const projectCount = await prisma.project.count({ where: { status: "OPEN" } });
  console.log("Total Open Projects:", projectCount);
  if (projectCount > 0) {
    const samples = await prisma.project.findMany({ 
      take: 5, 
      where: { status: "OPEN" },
      include: { requiredSkills: true } 
    });
    console.log("Sample Projects:", JSON.stringify(samples, null, 2));
  }
}

check();
