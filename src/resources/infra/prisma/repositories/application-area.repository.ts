import { ApplicationArea as ApplicationArea } from '../../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

export interface IApplicationAreaRepository {
  create(
    data: Partial<{
      geom: string;
      description: string;
      applicationId: number;
    }>,
  ): Promise<number>;
  createMany(
    data: Array<string>,
    description: string,
    applicationId: number,
  ): Promise<number>;
  findOne(id: number): Promise<ApplicationArea>;
  findAll(applicationId: number): Promise<ApplicationArea[]>;
  getAsGeoJson(applicationId: number): Promise<string>;
  removeOne(id: number): Promise<void>;
  removeAll(applicationId: number): Promise<void>;
}

@Injectable()
export class ApplicationAreaRepository implements IApplicationAreaRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      geom: string;
      description: string;
      applicationId: number;
    }>,
  ): Promise<number> {
    const result = await this.prisma.$executeRaw`
      INSERT INTO "SIGA"."S_AREA_APLICACAO" ("PG_GEOMETRIA", "PG_GEOMETRIA_JSON", "DS_DESCRICAO", "ID_APLICACAO")
      VALUES (ST_Force3D(ST_GeomFromGeoJSON(${data.geom})), ${data.geom}::text, ${data.description}::text, ${data.applicationId})`;

    return result;
  }

  async createMany(
    data: Array<string>,
    description: string,
    applicationId: number,
  ): Promise<number> {
    const result = await this.prisma.$transaction(
      async (tx) => {
        let count = 0;
        for (const d of data) {
          count += await tx.$executeRaw`
            INSERT INTO "SIGA"."S_AREA_APLICACAO" ("PG_GEOMETRIA", "PG_GEOMETRIA_JSON", "DS_DESCRICAO", "ID_APLICACAO")
            VALUES (ST_Force3D(ST_GeomFromGeoJSON(${d})), ${d}::text, ${description}::text, ${applicationId})`;
        }
        return count;
      },
      { timeout: 20000 },
    );

    return result;
  }

  async findOne(id: number): Promise<ApplicationArea> {
    const applicationArea = await this.prisma.applicationArea.findUnique({
      where: {
        id: id,
      },
    });

    return new ApplicationArea(applicationArea);
  }

  async findAll(applicationId: number): Promise<ApplicationArea[]> {
    const areas = await this.prisma.applicationArea.findMany({
      where: {
        application_id: applicationId,
      },
    });

    return areas;
  }

  async getAsGeoJson(applicationId: number): Promise<string> {
    const result = await this.prisma
      .$queryRaw<string>`SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM (select "ID_AREA_APLICACAO", "PG_GEOMETRIA" from "SIGA"."S_AREA_APLICACAO" as a where a."ID_APLICACAO" = ${applicationId}) as t`;

    return result[0]['json_build_object'];
  }

  async removeOne(id: number): Promise<void> {
    await this.prisma.applicationArea.delete({
      where: {
        id: id,
      },
    });
  }

  async removeAll(applicationId: number): Promise<void> {
    await this.prisma.applicationArea.deleteMany({
      where: {
        application_id: applicationId,
      },
    });
  }
}
