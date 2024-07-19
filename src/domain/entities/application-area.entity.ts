import * as Prisma from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Application } from './application.entity';

export class ApplicationArea {
  @ApiProperty({ description: 'ID da área da aplicação'})
  public id: number;

  // @ApiProperty({description: 'Geometria'})
  // public geom: string;

  @ApiProperty({description: 'Descrição da área'})
  public description: string;

  // @ApiProperty({ description: 'Data de criação da área da aplicação' })
  // createdAt: Date;

  // @ApiProperty({description: 'Aplicação'})
  // public application: Application;

  constructor(
    applicationArea: Prisma.ApplicationArea,
    // application: Prisma.Application
  ) {
    this.id = applicationArea.id;
    // this.geom = geom;
    this.description = applicationArea.description;
    // this.createdAt = applicationArea.created_at;
    // this.application = new Application(application);
  }
}
