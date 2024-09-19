import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { Application } from '../../../domain/entities';
import { ApplicationStatus } from '../../../domain/enums/application-status.enum';

function createApplicationStatusFixture(): Prisma.ApplicationStatus {
  return {
    application_status_id: faker.number.int(),
    description: faker.helpers.arrayElement(Object.keys(ApplicationStatus)),
    active: true,
    created_at: faker.date.recent(),
  };
}

function createUserFixture(): Prisma.User {
  return {
    user_id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    created_at: faker.date.recent(),
    document: faker.number.int().toString(),
    status: faker.helpers.arrayElement(Object.values(Prisma.UserStatus)),
  } as Prisma.User;
}

function createOrganizationFixture(): Prisma.Organization {
  return {
    organization_id: faker.number.int(),
    name: faker.company.name(),
    created_at: faker.date.recent(),
  } as Prisma.Organization;
}

function createPilotFixture({
  pilotId,
}: Partial<{ pilotId?: number }> = {}): Prisma.Pilot {
  return {
    pilot_id: pilotId ?? faker.number.int(),
    name: faker.person.fullName(),
    organization_id: faker.number.int(),
    document: faker.number.int().toString(),
    license: faker.number.int().toString(),
    created_at: faker.date.recent(),
  } as Prisma.Pilot;
}

function createApplicationEventFixture({
  statusId,
}: Partial<{ statusId?: ApplicationStatus }> = {}): Prisma.ApplicationEvent {
  return {
    application_event_id: faker.number.bigInt(),
    application_id: faker.number.bigInt(),
    application_status_id: statusId || 1,
    pilot_id: faker.number.int(),
    created_by: faker.number.int().toString(),
    created_at: faker.date.recent(),
  } as Prisma.ApplicationEvent;
}

export default function createApplicationFixture({
  applicationId,
  userId,
  organizationId,
  vehicle,
  startDate,
  endDate,
  pilotId,
  statusId,
}: Partial<{
  applicationId?: bigint;
  userId?: number;
  organizationId?: number;
  statusId?: ApplicationStatus;
  vehicle?: string;
  startDate?: string;
  endDate?: string;
  pilotId?: number;
}> = {}): Application {
  const applicationData: Prisma.Application = {
    application_id: applicationId ?? faker.number.bigInt(),
    user_id: userId ?? faker.number.int(),
    organization_id: organizationId ?? faker.number.int(),
    vehicle: vehicle ?? faker.vehicle.vehicle(),
    start_date: startDate ?? faker.date.past(),
    end_date: endDate ?? faker.date.future(),
    created_by: faker.number.int().toString(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  } as Prisma.Application;

  const lastEvent = createApplicationEventFixture({ statusId });
  const user = createUserFixture();
  const organization = createOrganizationFixture();
  const pilot = createPilotFixture({ pilotId });
  const status = createApplicationStatusFixture();

  return new Application(
    applicationData,
    lastEvent,
    user,
    organization,
    pilot,
    status,
  );
}
