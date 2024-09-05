import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';

export class Organization {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Nome da organização' })
  name: string;

  @ApiProperty({ description: 'Data de criação da organização' })
  created_at?: string;

  constructor(organization: Prisma.Organization) {
    this.id = organization.organization_id;
    this.name = organization.name;
  }
}
