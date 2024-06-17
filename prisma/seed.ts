import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function applicatioStatusSeed() {
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

async function main() {
  await applicatioStatusSeed();
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
