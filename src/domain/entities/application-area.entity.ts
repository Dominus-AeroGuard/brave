import * as Prisma from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ApplicationArea {
  @ApiProperty({ description: 'ID da área da aplicação'})
  public id: number;

  @ApiProperty({description: 'Geometria GeoJSON'})
  public geomjson: string;

  @ApiProperty({description: 'Descrição da área'})
  public description: string;

  constructor(
    applicationArea: Prisma.ApplicationArea,
  ) {
    this.id = applicationArea.id;
    this.geomjson = applicationArea.geomjson;
    this.description = applicationArea.description;
  }
}
