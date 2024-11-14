import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';
import { Organization } from './organization.entity';

export class OrganizationArea {
  @ApiProperty({ description: 'ID da área da organização' })
  public id: number;

  @ApiProperty({ description: 'Geometria GeoJSON' })
  public geomjson: string;

  @ApiProperty({ description: 'Organização que criou a área de proteção' })
  organization: Organization;

  constructor(
      organizationArea: Prisma.OrganizationArea,
      organization: Prisma.Organization
  ) {
    this.id = organizationArea.id;
    this.geomjson = organizationArea.geomjson;
    this.organization = new Organization(organization);
  }
}
