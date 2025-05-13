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

    // Additional logs - Two weeks ago (more dates)
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-03T08:15:00.000Z') // Saturday two weeks ago
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-03T17:45:00.000Z') // Saturday two weeks ago, evening
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-02T10:30:00.000Z') // Friday two weeks ago
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-05-01T14:20:00.000Z') // Thursday two weeks ago
      }
    });

    // Three weeks ago
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-27T09:10:00.000Z') // Sunday three weeks ago
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-25T16:05:00.000Z') // Friday three weeks ago
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-24T11:30:00.000Z') // Thursday three weeks ago
      }
    });

    // Four weeks ago
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-20T13:45:00.000Z') // Sunday four weeks ago
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-19T18:30:00.000Z') // Saturday four weeks ago
      }
    });

    // More logs in April (over a month ago)
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-15T09:20:00.000Z') // Mid-April
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-12T14:15:00.000Z') // Early-April
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-10T11:45:00.000Z') // Early-April
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-08T16:30:00.000Z') // Early-April
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-04-05T10:15:00.000Z') // Early-April
      }
    });

    // March logs (over a month ago)
    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-03-30T13:10:00.000Z') // End of March
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-03-25T09:45:00.000Z') // Late March
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-03-20T15:30:00.000Z') // Mid-March
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-03-15T11:20:00.000Z') // Mid-March
      }
    });

    await prisma.choreLog.create({
      data: {
        choreId: 2,
        userId: 'cmala5ug40000xesm6h4ut8zz',
        groupId: 1,
        createdAt: new Date('2025-03-10T14:05:00.000Z') // Early March
      }
    });

    console.log('Successfully inserted 30 chore logs');
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
