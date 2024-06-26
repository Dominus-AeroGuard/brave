import * as Prisma from '@prisma/client';

export class Organization {
  id: number;
  name: string;
  created_at: string;

  constructor(organization: Prisma.Organization) {
    this.id = organization.organization_id;
    this.name = organization.name;
  }
}
