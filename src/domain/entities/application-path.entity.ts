import * as Prisma from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ApplicationPath {
  @ApiProperty({ description: 'ID da área da aplicação' })
  public id: number;

  @ApiProperty({ description: 'Geometria GeoJSON' })
  public geomjson: string;

  @ApiProperty({ description: 'Descrição da linha' })
  public description: string;

  constructor(applicationPath: Prisma.ApplicationPath) {
    this.id = applicationPath.id;
    this.geomjson = applicationPath.geomjson;
    this.description = applicationPath.description;
  }
}
