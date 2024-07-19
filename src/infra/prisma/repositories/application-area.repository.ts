import { application } from 'express';
import { ApplicationArea as ApplicationArea } from '../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { JsonObject } from '@prisma/client/runtime/library';

export interface IApplicationAreaRepository {
  create(
    data: Partial<{
      geom: string;
      description: string;
      applicationId: number;
    }>,
  ): Promise<number>;
  findOne(id: number): Promise<ApplicationArea>;
  // update(
  //   id: number,
  //   data: Partial<{
  //     geom: string;
  //     description: string;
  // }>,
  // ): Promise<ApplicationArea>;
  // remove(id: number, applicationId: number): Promise<void>;
  findAll(applicationId: number): Promise<ApplicationArea[]>;
}

@Injectable()
export class ApplicationAreaRepository
  implements IApplicationAreaRepository
{
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<ApplicationArea> {
    const applicationArea = await this.prisma.applicationArea.findUnique({
        where: {
          id: id,
        },
    });

    return new ApplicationArea(applicationArea);
  }

  async create(
    data: Partial<{
      geom: string;
      description: string;
      applicationId: number;
    }>,
  ): Promise<number> {
    const result = await this.prisma.$executeRaw`INSERT INTO "application_area" ("geom", "description", "application_id") VALUES (ST_GeomFromGeoJSON(${data.geom}), ${data.description}::text, ${data.applicationId})`;
    
    return result;
  }

  // async update(
  //   id: number,
  //   data: Partial<{
  //     geom: string;
  //     description: string;
  // }>,
  // ): Promise<ApplicationArea> {
  //   const applicationArea = await this.prisma.applicationArea.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       geom: data.geom,
  //       description: data.description,
  //     },
  //   });

  //   return this.buildApplicationAreaEntity(applicationArea);
  // }

  // async remove(id: number, applicationId: number): Promise<void> {
  //   await this.prisma.applicationArea.delete({
  //     where: {
  //       id: id,
  //       application_id: applicationId,
  //     },
  //   });
  // }

  async findAll(applicationId: number): Promise<ApplicationArea[]> {
    const areas = await this.prisma.applicationArea.findMany({
      where: {
        application_id: applicationId,
      },
    });

    return areas;
  }
}
