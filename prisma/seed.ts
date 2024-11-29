import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  
  // Create default admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@splitsavor.com" },
    update: {},
    create: {
      email: "admin@splitsavor.com",
      name: "Admin User",
      password: adminPassword,
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });