const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { hashSync } = require("bcryptjs");
require("dotenv").config();

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
};

const prisma = createPrismaClient();

async function main() {
  const adminEmail = "admin@collabolab.com";
  const adminPassword = "admincollabolabgalatea";
  const hashedPassword = hashSync(adminPassword, 10);

  console.log("Seeding admin user...");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      password: hashedPassword,
      onboardingDone: true,
      emailVerified: new Date(),
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
      onboardingDone: true,
      emailVerified: new Date(),
      trustScore: 100,
      trustLevel: "VERIFIED",
    },
  });

  console.log("Admin user created/updated:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
