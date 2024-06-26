import * as Prisma from '@prisma/client';
import { Organization } from './organization.entity';
import { Pilot } from './pilot.entity';
import { User } from './user.entity';

export class Application {
  id: string;
  vehicle: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  user: User;
  organization: Organization;
  pilot: Pilot;
  status: ApplicationStatus;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    application: Prisma.Application,
    lastEvent: Prisma.ApplicationEvent,
    user: Prisma.User,
    organization: Prisma.Organization,
    pilot: Prisma.Pilot,
    status: Prisma.ApplicationStatus,
  ) {
    this.id = application.application_id.toString();
    this.vehicle = application.vehicle;
    this.startDate = application.start_date;
    this.endDate = application.end_date;
    this.user = new User(user);
    this.organization = new Organization(organization);
    this.pilot = new Pilot(pilot);
    this.status = new ApplicationStatus(status);
    this.createdBy = application.created_by;
    this.createdAt = application.created_at;
    this.updatedAt = lastEvent.created_at;
  }
}

class ApplicationStatus {
  id: number;
  description: string;

  constructor(status: Prisma.ApplicationStatus) {
    this.id = status.application_status_id;
    this.description = status.description;
  }
}
