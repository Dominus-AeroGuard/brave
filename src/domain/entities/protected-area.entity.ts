import * as Prisma from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';

export class ProtectedAreaType {
  @ApiProperty({ description: 'ID do tipo de área de proteção', example: 1 })
  public id: number;

  @ApiProperty({description: 'Nome do tipo de área de proteção', example: 'AREA_URBANA' })
  public name: string;

  @ApiProperty({description: 'Descrição do tipo de área de proteção', example: 'Área de proteção permanente' })
  public description: string;

  @ApiProperty({ description: 'Distância mínima permitida para aplicações aéreas', example: 500 })
  public distance: number;

  @ApiProperty({ description: 'Distância mínima permitida para aplicações com drone', example: 20 })
  public distance_drone: number;

  constructor(
    id: number, 
    name: string, 
    description: string, 
    distance: number, 
    distance_drone: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.distance = distance;
    this.distance_drone = distance_drone;
  }
}
export class ProtectedArea {
  @ApiProperty({ description: 'ID da área de proteção' })
  public id: number;

  @ApiProperty({ description: 'Geometria GeoJSON' })
  public geomjson: string;

  @ApiProperty({ description: 'Descrição da área' })
  public description: string;

  @ApiProperty({ description: 'Tipo de área de proteção' })
  type: ProtectedAreaType;

  @ApiProperty({ description: 'Organização que criou a área de proteção' })
  organization: Organization;

  @ApiProperty({
    description: 'Usuário que criou a área de proteção',
    example: '1',
  })
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
