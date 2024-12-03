import { ProtectedAreaType } from '../../../../domain/entities/protected-area.entity';
import { ProtectedArea as ProtectedArea } from '../../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface IProtectedAreaRepository {
  create(
    data: Partial<{
      geom: string;
      description: string;
      type: Partial<{ id: number }>;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
    }>,
  ): Promise<number>;
  createMany(
    geoms: Array<string>,
    description: string,
    typeId: number,
    organizationId: number,
    userId: number,
  ): Promise<number>;
  findOne(id: number): Promise<ProtectedArea>;
  findAll(organizationId: number, typeId: number): Promise<ProtectedArea[]>;
  findByDistance(
    applicationId: number,
    distance: number,
    typeId: number,
  ): Promise<ProtectedArea[]>;
  getDistanceTo(id: number, applicationId: number): Promise<number>;
  getAsGeoJson(id: number[]): Promise<string>;
  getWithBufferAsGeoJson(id: number[]): Promise<string>;
  removeOne(organizationId: number, id: number): Promise<void>;
  removeAll(organizationId: number, typeId: number): Promise<void>;
}

@Injectable()
export class ProtectedAreaRepository implements IProtectedAreaRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      geom: string;
      description: string;
      type: Partial<{ id: number }>;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
    }>,
  ): Promise<number> {
    const result = await this.prisma.$executeRaw`
      INSERT INTO "SIGA"."S_AREA_PROTEGIDA" ("PG_GEOMETRIA", "PG_GEOMETRIA_JSON", "DS_DESCRICAO", "ID_TIPO_AREA_PROTEGIDA", "ID_ORGANIZACAO", "NM_CRIADO_POR")
      VALUES (ST_Force3D(ST_GeomFromGeoJSON(${data.geom})), ${data.geom}::text, ${data.description}::text, ${data.type.id}, ${data.organization.id}, ${data.user.id.toString()}::text)`;

    return result;
  }

  async createMany(
    geoms: Array<string>,
    description: string,
    typeId: number,
    organizationId: number,
    userId: number,
  ): Promise<number> {
    const result = await this.prisma.$transaction(
      async (tx) => {
        let count = 0;
        for (const geom of geoms) {
          count += await tx.$executeRaw`
            INSERT INTO "SIGA"."S_AREA_PROTEGIDA" ("PG_GEOMETRIA", "PG_GEOMETRIA_JSON", "DS_DESCRICAO", "ID_TIPO_AREA_PROTEGIDA", "ID_ORGANIZACAO", "NM_CRIADO_POR")
            VALUES (ST_Force3D(ST_GeomFromGeoJSON(${geom})), ${geom}::text, ${description}::text, ${typeId}, ${organizationId}, ${userId.toString()}::text)`;
        }
        return count;
      },
      { timeout: 20000 },
    );
    return result;
  }

  async findOne(id: number): Promise<ProtectedArea> {
    const protected_area = await this.prisma.protectedArea.findUnique({
      where: {
        id: id,
      },
      include: {
        organization: true,
        type: true,
      },
    });

    return new ProtectedArea(
      protected_area,
      protected_area.organization,
      new ProtectedAreaType(
        protected_area.type.protected_area_type_id,
        protected_area.type.name,
        protected_area.type.description,
        protected_area.type.distance,
        protected_area.type.distance_drone,
      ),
    );
  }

  async findAll(
    organizationId: number,
    typeId: number,
  ): Promise<ProtectedArea[]> {
    const protected_areas = await this.prisma.protectedArea.findMany({
      where: {
        organization_id: organizationId,
        protected_area_type_id: typeId,
      },
      include: {
        organization: true,
        type: true,
      },
    });

    return protected_areas.map((protected_area) => {
      return new ProtectedArea(
        protected_area,
        protected_area.organization,
        new ProtectedAreaType(
          protected_area.type.protected_area_type_id,
          protected_area.type.name,
          protected_area.type.description,
          protected_area.type.distance,
          protected_area.type.distance_drone,
        ),
      );
    });
  }

  async findByDistance(
    applicationId: number,
    distance: number,
    typeId: number,
  ): Promise<ProtectedArea[]> {
    const ids = await this.prisma.$queryRaw<
      ProtectedArea[]
    >`SELECT distinct p."ID_AREA_PROTEGIDA" FROM "SIGA"."S_AREA_PROTEGIDA" as p, "SIGA"."S_AREA_APLICACAO" as a where ST_Intersects(p."PG_GEOMETRIA" , ST_Buffer(a."PG_GEOMETRIA"::geography , ${distance})) and p."ID_TIPO_AREA_PROTEGIDA" = ${typeId} and a."ID_APLICACAO" = ${applicationId}`;

    const protected_areas = await this.prisma.protectedArea.findMany({
      where: {
        id: { in: ids.map((item) => item.id) },
      },
      include: {
        organization: true,
        type: true,
      },
    });

    return protected_areas.map((protected_area) => {
      return new ProtectedArea(
        protected_area,
        protected_area.organization,
        new ProtectedAreaType(
          protected_area.type.protected_area_type_id,
          protected_area.type.name,
          protected_area.type.description,
          protected_area.type.distance,
          protected_area.type.distance_drone,
        ),
      );
    });
  }

  async getDistanceTo(id: number, applicationId: number): Promise<number> {
    return await this.prisma
      .$queryRaw<number>`select min(ST_Distance(p."PG_GEOMETRIA"::geography, a."PG_GEOMETRIA"::geography)) from "SIGA"."S_AREA_PROTEGIDA" as p, "SIGA"."S_AREA_APLICACAO" as a where p."ID_AREA_PROTEGIDA" = ${id} and a."ID_APLICACAO" = ${applicationId}`;
  }

  async getAsGeoJson(ids: number[]): Promise<string> {
    // const where = ids.map(item => item).join(',');
    const result = await this.prisma
      .$queryRaw<string>`SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM (select p."ID_AREA_PROTEGIDA", p."PG_GEOMETRIA" from "SIGA"."S_AREA_PROTEGIDA" as p where p."ID_AREA_PROTEGIDA" in (${Prisma.join(ids)})) as t`;

    return result[0]['json_build_object'];
  }

  async getWithBufferAsGeoJson(ids: number[]): Promise<string> {
    // const where = ids.map(item => item).join(',');
    const result = await this.prisma
      .$queryRaw<string>`SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM (select p."ID_AREA_PROTEGIDA", ST_Buffer(p."PG_GEOMETRIA"::geography, pt."NR_DISTANCIA") from "SIGA"."S_AREA_PROTEGIDA" as p inner join "SIGA"."S_TIPO_AREA_PROTEGIDA" as pt on p."ID_TIPO_AREA_PROTEGIDA" = pt."ID_TIPO_AREA_PROTEGIDA" where p."ID_AREA_PROTEGIDA" in (${Prisma.join(ids)})) as t`;

    return result[0]['json_build_object'];
  }

  async removeOne(organizationId: number, id: number): Promise<void> {
    await this.prisma.protectedArea.delete({
      where: {
        organization_id: organizationId,
        id: id,
      },
    });
  }

  async removeAll(organizationId: number, typeId: number): Promise<void> {
    await this.prisma.protectedArea.deleteMany({
      where: {
        organization_id: organizationId,
        protected_area_type_id: typeId,
      },
    });
  }
}
