import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function applicationStatusSeed() {
  const applicationStatus = [
    {
      id: 1,
      description: 'Planning',
      active: true,
    },
    {
      id: 2,
      description: 'Finished',
      active: true,
    },
    {
      id: 3,
      description: 'Aborted',
      active: true,
    },
  ];

  const insertApplicationStatus = applicationStatus.map(({ id, ...rest }) =>
    prisma.applicationStatus.upsert({
      where: {
        application_status_id: id,
      },
      update: {
        description: rest.description,
        active: rest.active,
      },
      create: {
        application_status_id: id,
        description: rest.description,
        active: rest.active,
      },
    }),
  );

  await Promise.all(insertApplicationStatus);

  console.log('\n\t✔  application_status has been seeded');
}

async function organizationSeed() {
  return prisma.organization.upsert({
    where: {
      organization_id: 1,
    },
    update: {
      name: 'Test Organization',
    },
    create: {
      name: 'Test Organization',
    },
  });
}

async function userSeed() {
  return prisma.user.upsert({
    where: {
      user_id: 1,
    },
    update: {
      name: 'Jonh Doe',
    },
    create: {
      name: 'Jonh Doe',
      email: 'jonh@example.com',
      document: '92564656048',
      status: 'ACTIVE',
    },
  });
}

async function pilotSeed() {
  return prisma.pilot.upsert({
    where: {
      pilot_id: 1,
    },
    update: {
      name: 'Jonh Doe',
    },
    create: {
      name: 'Jonh Doe',
      license: '123456',
      document: '92564656048',
      organization_id: 1,
    },
  });
}

async function main() {
  await applicationStatusSeed();
  await organizationSeed();
  await userSeed();
  await pilotSeed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
