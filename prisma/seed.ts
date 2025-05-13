import { PrismaClient } from "../src/generated/prisma";

// Initialize Prisma client for seeding using the same pattern as the app
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting to seed chore logs...");
    
    // Insert chore logs for today
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-13T09:15:00.000Z')
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-13T14:30:00.000Z')
      }
    });

    // Insert chore logs for yesterday
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-12T08:45:00.000Z')
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-12T19:20:00.000Z')
      }
    });

    // Insert chore logs for Sunday (last week)
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-11T10:10:00.000Z')
      }
    });

    // Insert chore logs for Saturday (last week)
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-10T11:30:00.000Z')
      }
    });

    // Insert chore logs for Friday (last week)
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-09T16:45:00.000Z')
      }
    });

    // Insert chore logs for two weeks ago
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-06T13:15:00.000Z')
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-04T09:30:00.000Z')
      }
    });

    // Insert chore logs for a month ago
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-13T12:00:00.000Z')
      }
    });

    console.log('Successfully inserted 10 chore logs');
  } catch (error) {
    console.error('Error inserting chore logs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
