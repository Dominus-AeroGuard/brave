import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function protectedAreaTypeSeed() {
  const protectedAreaType = [
    {
      id: 1,
      name: 'RESERVA_LEGAL_APP',
      description: 'Reserva Legal ou Área de Proteção Permanente',
      distance: 500,
      distance_drone: 20,
      active: true,
    },
    {
      id: 2,
      name: 'AREA_URBANA',
      description: 'Povoações, Cidades, Vilas ou Bairros',
      distance: 500,
      distance_drone: 20,
      active: true,
    },
    {
      id: 3,
      name: 'MANANCIAL_PARA_ABASTECIMENTO',
      description: 'Mananciais de captação de água para abastecimento de população',
      distance: 500,
      distance_drone: 20,
      active: true,
    },
    {
      id: 4,
      name: 'MANANCIAL',
      description: 'Mananciais de água',
      distance: 250,
      distance_drone: 20,
      active: true,
    },
    {
      id: 5,
      name: 'MORADIA_ISOLADA',
      description: 'Moradias isoladas',
      distance: 250,
      distance_drone: 20,
      active: true,
    },
    {
      id: 6,
      name: 'AGRUPAMENTO_DE_ANIMAIS',
      description: 'agrupamentos de animais',
      distance: 250,
      distance_drone: 20,
      active: true,
    },
    {
      id: 7,
      name: 'SERICICULTURA',
      description: 'SERICICULTURA',
      distance: 500,
      distance_drone: 20,
      active: true,
    },
  ];

  const insertprotectedAreaType = protectedAreaType.map(({ id, ...rest }) =>
    prisma.protectedAreaType.upsert({
      where: {
        protected_area_type_id: id,
      },
      update: {
        name: rest.name,
        description: rest.description,
        distance: rest.distance,
        distance_drone: rest.distance_drone
      },
      create: {
        protected_area_type_id: id,
        name: rest.name,
        description: rest.description,
        distance: rest.distance,
        distance_drone: rest.distance_drone
      },
    }),
  );

  await Promise.all(insertprotectedAreaType);

  console.log('\n\t✔  protected_area_type has been seeded');
}

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

async function applicationAnalisysType() {
  const applicationAnalisysType = [
    {
      id: 1,
      name: 'CLIMA',
    },
    {
      id: 2,
      name: 'BUFFER',
    },
    {
      id: 3,
      name: 'BULA',
    },
    {
      id: 4,
      name: 'VALIDADE_DOCUMENTOS',
    },
    {
      id: 5,
      name: 'PRE_APLICACAO_PREENCHIDA',
    },
    {
      id: 6,
      name: 'GEOLOCALIZAO',
    },
    {
      id: 7,
      name: 'DENTRO_DO_PRAZO',
    },
  ];

  const insertApplicationAnalisysType = applicationAnalisysType.map(
    ({ id, ...rest }) =>
      prisma.applicationAnalisysType.upsert({
        where: {
          application_analisys_type_id: id,
        },
        update: {
          name: rest.name,
        },
        create: {
          name: rest.name,
        },
      }),
  );

  await Promise.all(insertApplicationAnalisysType);

  console.log('\n\t✔  application_analisys_type has been seeded');
}

async function applicationNotificationStatus() {
  const applicationNotificationStatus = [
    {
      id: 1,
      description: 'PENDENTE',
      active: true,
    },
    {
      id: 2,
      description: 'FINALIZADA',
      active: true,
    },
  ];

  const insertApplicationNotificationStatus = applicationNotificationStatus.map(
    ({ id, ...rest }) =>
      prisma.applicationNotificationStatus.upsert({
        where: {
          id,
        },
        update: {
          description: rest.description,
        },
        create: {
          description: rest.description,
          active: rest.active,
        },
      }),
  );

  await Promise.all(insertApplicationNotificationStatus);

  console.log('\n\t✔  application_notification_status has been seeded');
}

async function organizationSeed() {
  await prisma.organization.upsert({
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

  console.log('\n\t✔  organization has been seeded');
}

async function userSeed() {
  await prisma.user.upsert({
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

  console.log('\n\t✔  user has been seeded');
}

async function pilotSeed() {
  await prisma.pilot.upsert({
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

  console.log('\n\t✔  pilot has been seeded');
}

async function main() {
  if (process.env.NODE_ENV === 'development') {
    await organizationSeed();
    await userSeed();
    await pilotSeed();
  }

  await applicationStatusSeed();
  await applicationAnalisysType();
  await protectedAreaTypeSeed();
  await applicationNotificationStatus();
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
