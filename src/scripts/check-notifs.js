const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const notifs = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: { select: { name: true } } }
  });
  console.log("Recent Notifications:", JSON.stringify(notifs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
