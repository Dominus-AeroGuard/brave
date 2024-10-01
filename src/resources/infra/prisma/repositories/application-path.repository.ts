import { ApplicationPath as ApplicationPath } from '../../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

export interface IApplicationPathRepository {
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
  findOne(id: number): Promise<ApplicationPath>;
  findAll(applicationId: number): Promise<ApplicationPath[]>;
  getAsGeoJson(applicationId: number): Promise<string>;
  removeOne(id: number): Promise<void>;
  removeAll(applicationId: number): Promise<void>;
}

@Injectable()
export class ApplicationPathRepository implements IApplicationPathRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      geom: string;
      description: string;
      applicationId: number;
    }>,
  ): Promise<number> {
    const result = await this.prisma.$executeRaw`
      INSERT INTO "application_path" ("geom", "geomjson", "description", "application_id")
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
            INSERT INTO "application_path" ("geom", "geomjson", "description", "application_id")
            VALUES (ST_Force3D(ST_GeomFromGeoJSON(${d})), ${d}::text, ${description}::text, ${applicationId})`;
        }
        return count;
      },
      { timeout: 20000 },
    );

    return result;
  }

  async findOne(id: number): Promise<ApplicationPath> {
    const applicationPath = await this.prisma.applicationPath.findUnique({
      where: {
        id: id,
      },
    });

    return new ApplicationPath(applicationPath);
  }

  async findAll(applicationId: number): Promise<ApplicationPath[]> {
    const paths = await this.prisma.applicationPath.findMany({
      where: {
        application_id: applicationId,
      },
    });

    return paths;
  }

  async getAsGeoJson(applicationId: number): Promise<string> {
    const result = await this.prisma
      .$queryRaw<string>`SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM (select id, geom from "application_path" as a where a.application_id = ${applicationId}) as t`;

    return result[0]['json_build_object'];
  }

  async removeOne(id: number): Promise<void> {
    await this.prisma.applicationPath.delete({
      where: {
        id: id,
      },
    });
  }

  async removeAll(applicationId: number): Promise<void> {
    await this.prisma.applicationPath.deleteMany({
      where: {
        application_id: applicationId,
      },
    });
  }
}
