// eslint-disable-next-line @typescript-eslint/no-var-requires
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
      description:
        'Mananciais de captação de água para abastecimento de população',
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
        distance_drone: rest.distance_drone,
      },
      create: {
        protected_area_type_id: id,
        name: rest.name,
        description: rest.description,
        distance: rest.distance,
        distance_drone: rest.distance_drone,
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

async function applicationDocumentType() {
  const applicationDocumentTypes = [
    {
      id: 1,
      description: 'RA',
      active: true,
    },
    {
      id: 2,
      description: 'RO',
      active: true,
    },
    {
      id: 3,
      description: 'KML',
      active: true,
    },
  ];

  const insertApplicationDocumentTypes = applicationDocumentTypes.map(
    ({ id, ...rest }) =>
      prisma.applicationDocumentType.upsert({
        where: {
          application_document_type_id: id,
        },
        update: {
          description: rest.description,
          active: rest.active,
        },
        create: {
          description: rest.description,
          active: rest.active,
        },
      }),
  );

  await Promise.all(insertApplicationDocumentTypes);

  console.log('\n\t✔  application_document_type has been seeded');
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
      userRoles: {
        connectOrCreate: {
          where: {
            user_role_id: 1,
          },
          create: {
            role_id: 1, // admin
            created_by: 1,
          },
        },
      },
      userPermissions: {
        connectOrCreate: {
          where: {
            user_permission_id: 1,
          },
          create: {
            permission_id: 1, // user:read
            created_by: 1,
          },
        },
      },
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

async function rolesSeed() {
  const roles = [
    {
      id: 1,
      role: 'admin',
      description: 'Papel de gerenciamento de perfis e usuários no SIGA',
      created_by: 1,
    },
    {
      id: 2,
      role: 'organization_admin',
      organization_id: 1,
      description: 'Papel de gerenciamento de uma organização',
      created_by: 1,
    },
    {
      id: 3,
      role: 'prestador',
      organization_id: 1,
      description: 'Papel responsável por gerenciar uma aplicação',
      created_by: 1,
    },
  ];

  const promises = await roles.map(
    ({ id: role_id, role, organization_id, description, created_by }) =>
      prisma.role.upsert({
        where: {
          role_id,
        },
        update: {
          role,
          organization_id,
          description,
          created_by,
        },
        create: {
          role,
          organization_id,
          description,
          created_by,
        },
      }),
  );

  await Promise.all(promises);

  console.log('\n\t✔  roles has been seeded');
}

async function rolePermissionsSeed() {
  const rolePermissions = [
    {
      role_permission_id: 1,
      permission_id: 3, // application:read
      role_id: 3, //  prestador
    },
  ];

  const promises = rolePermissions.map(
    ({ role_permission_id, permission_id, role_id }) =>
      prisma.rolePermission.upsert({
        where: {
          role_permission_id,
        },
        update: {
          permission_id,
          role_id,
        },
        create: {
          permission_id,
          role_id,
          created_by: 1,
        },
      }),
  );

  await Promise.all(promises);
}

async function permissionsSeed() {
  const permissions = [
    {
      id: 1,
      resource: 'user',
      action: 'read',
      description: 'Permiter ler todos usuários',
      created_by: 1,
    },
    {
      id: 2,
      resource: 'user',
      action: 'write',
      description: 'Permite criar e gerenciar usuários',
      created_by: 1,
    },
    {
      id: 3,
      resource: 'application',
      action: 'read',
      organization_id: 1,
      description: 'Permite consultar aplicações',
      created_by: 1,
    },
    {
      id: 4,
      resource: 'application',
      action: 'write',
      organization_id: 1,
      description: 'Permite criar e gerenciar aplicacoes',
      created_by: 1,
    },
    {
      id: 5,
      resource: 'notification',
      action: 'read',
      organization_id: 1,
      description: 'Permite consultar notificações',
      created_by: 1,
    },
  ];

  const promises = await permissions.map(
    ({ id, resource, action, description, organization_id, created_by }) =>
      prisma.permission.upsert({
        where: {
          permission_id: id,
        },
        update: {
          resource,
          action,
          description,
          organization_id,
          created_by,
        },
        create: {
          resource,
          action,
          description,
          organization_id,
          created_by,
        },
      }),
  );

  await Promise.all(promises);

  console.log('\n\t✔  permissions has been seeded');
}

async function main() {
  if (process.env.NODE_ENV === 'development') {
    await organizationSeed();
    await permissionsSeed();
    await rolesSeed();
    await rolePermissionsSeed();
    await pilotSeed();
    await userSeed();
  }

  await applicationStatusSeed();
  await applicationAnalisysType();
  await protectedAreaTypeSeed();
  await applicationNotificationStatus();
  await applicationDocumentType();
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
