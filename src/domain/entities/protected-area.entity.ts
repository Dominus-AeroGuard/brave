import * as Prisma from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';

export class ProtectedAreaType {
  @ApiProperty({ description: 'ID do tipo de área de proteção', example: 1 })
  public id: number;

  @ApiProperty({ description: 'Descrição do tipo de área de proteção', example: 'Área de proteção ambiental' })
  public description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}

export class ProtectedArea {
  @ApiProperty({ description: 'ID da área de proteção'})
  public id: number;

  @ApiProperty({description: 'Geometria GeoJSON'})
  public geomjson: string;

  @ApiProperty({description: 'Descrição da área'})
  public description: string;

  @ApiProperty({description: 'Tipo de área de proteção'})
  type: ProtectedAreaType;

  @ApiProperty({ description: 'Organização que criou a área de proteção' })
  organization: Organization;

  @ApiProperty({ description: 'Usuário que criou a área de proteção', example: '1' })
  createdBy: string;

  @ApiProperty({ description: 'Data de criação da área de proteção' })
  createdAt: Date;

  constructor(
    protectedArea: Prisma.ProtectedArea,
    organization: Prisma.Organization,
    type: ProtectedAreaType,
  ) {
    this.id = protectedArea.id;
    this.geomjson = protectedArea.geomjson;
    this.description = protectedArea.description;
    this.type = type;
    this.organization = new Organization(organization);
    this.createdBy = protectedArea.created_by;
    this.createdAt = protectedArea.created_at;
  }
}
