import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';

export class Pilot {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Nome do piloto' })
  name: string;

  @ApiProperty({ description: 'Documento do piloto (CPF | CNPJ)' })
  document: string;

  @ApiProperty({ description: 'Licença do piloto' })
  license: string;

  constructor(pilot: Prisma.Pilot) {
    this.id = pilot.pilot_id;
    this.name = pilot.name;
    this.document = pilot.document;
    this.license = pilot.license;
  }
}
