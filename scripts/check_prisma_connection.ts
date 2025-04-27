
import { PrismaClient } from "@/generated/prisma";

async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("✅ Prisma connection succeeded");
    await prisma.$disconnect();
    process.exit(0); // success
  } catch (error) {
    console.error("❌ Prisma connection failed");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1); // fail the build
  }
}

main();