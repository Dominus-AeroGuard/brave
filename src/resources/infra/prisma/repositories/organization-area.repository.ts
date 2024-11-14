import { OrganizationArea as OrganizationArea } from '../../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

export interface IOrganizationAreaRepository {
  create(
    data: Partial<{
      geom: string;
      organization: Partial<{ id: number }>;
    }>,
  ): Promise<number>;
  createMany(
    data: Array<string>,
    organizationId: number,
  ): Promise<number>;
  findOne(organizationId: number, id: number): Promise<OrganizationArea>;
  findAll(organizationId: number): Promise<OrganizationArea[]>;
  getAsGeoJson(organizationId: number): Promise<string>;
  removeOne(organizationId: number, id: number): Promise<void>;
  removeAll(organizationId: number): Promise<void>;
}

@Injectable()
export class OrganizationAreaRepository implements IOrganizationAreaRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      geom: string;
      organization: Partial<{ id: number }>;
    }>,
  ): Promise<number> {
    const result = await this.prisma.$executeRaw`
      INSERT INTO "organization_area" ("geom", "geomjson", "organization_id")
      VALUES (ST_Force3D(ST_GeomFromGeoJSON(${data.geom})), ${data.geom}::text, ${data.organization.id})`;

    return result;
  }

  async createMany(
    data: Array<string>,
    organizationId: number,
  ): Promise<number> {
    const result = await this.prisma.$transaction(
      async (tx) => {
        let count = 0;
        for (const d of data) {
          count += await tx.$executeRaw`
            INSERT INTO "organization_area" ("geom", "geomjson", "organization_id")
            VALUES (ST_Force3D(ST_GeomFromGeoJSON(${d})), ${d}::text, ${organizationId})`;
        }
        return count;
      },
      { timeout: 20000 },
    );

    return result;
  }

  async findOne(organizationId: number, id: number): Promise<OrganizationArea> {
    const organizationArea = await this.prisma.organizationArea.findUnique({
      where: {
        organization_id: organizationId,
        id: id,
      },
      include: {
        organization: true,
      },
    });

    return new OrganizationArea(
      organizationArea,
      organizationArea.organization
    );
  }

  async findAll(organizationId: number): Promise<OrganizationArea[]> {
    const areas = await this.prisma.organizationArea.findMany({
      where: {
        organization_id: organizationId,
      },
      include: {
        organization: true,
      },
    });

    return areas.map((organization_area) => {
      return new OrganizationArea(
        organization_area,
        organization_area.organization
      );
    });
  }

  async getAsGeoJson(organizationId: number): Promise<string> {
    const result = await this.prisma
      .$queryRaw<string>`SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM (select id, geom from "organization_area" as a where a.organization_id = ${organizationId}) as t`;

    return result[0]['json_build_object'];
  }

  async removeOne(organizationId: number, id: number): Promise<void> {
    await this.prisma.organizationArea.delete({
      where: {
        organization_id: organizationId,
        id: id,
      },
    });
  }

  async removeAll(organizationId: number): Promise<void> {
    await this.prisma.organizationArea.deleteMany({
      where: {
        organization_id: organizationId,
      },
    });
  }
}
