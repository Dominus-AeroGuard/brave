import { ProtectedAreaType } from '../../../domain/entities/protected-area.entity';
import { ProtectedArea as ProtectedArea, Organization } from '../../../domain/entities';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

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
  findByDistance(applicationId: number, distance: number, typeId: number): Promise<ProtectedArea[]>;
  removeOne(organizationId: number, id: number): Promise<void>;
  removeAll(organizationId: number, typeId: number): Promise<void>;
}

@Injectable()
export class ProtectedAreaRepository
  implements IProtectedAreaRepository
{
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
    const result = await this.prisma.$executeRaw`INSERT INTO "protected_area" ("geom", "geomjson", "description", "protected_area_type_id", "organization_id", "created_by") VALUES (ST_GeomFromGeoJSON(${data.geom}), ${data.geom}::text, ${data.description}::text, ${data.type.id}, ${data.organization.id}, ${data.user.id.toString()}::text)`;
    
    return result;
  }

  async createMany(
    geoms: Array<string>,
    description: string,
    typeId: number,
    organizationId: number,
    userId: number,
  ): Promise<number> {
    const result = await this.prisma.$transaction(async(tx) => {  
      let count = 0;
      for(let geom of geoms){
        count += await this.prisma.$executeRaw`INSERT INTO "protected_area" ("geom", "geomjson", "description", "protected_area_type_id", "organization_id", "created_by") VALUES (ST_GeomFromGeoJSON(${geom}), ${geom}::text, ${description}::text, ${typeId}, ${organizationId}, ${userId.toString()}::text)`
      }
      return count;
    }, { timeout: 20000 });
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
      }
    });

    return new ProtectedArea(
      protected_area, 
      protected_area.organization, 
      new ProtectedAreaType(protected_area.type.protected_area_type_id, protected_area.type.description));
  }

  async findAll(organizationId: number, typeId: number): Promise<ProtectedArea[]> {
    const protected_areas = await this.prisma.protectedArea.findMany({
      where: {
        organization_id: organizationId,
        protected_area_type_id: typeId
      },
      include: {
        organization: true,
        type: true,
      }
    });

    return protected_areas.map((protected_area) => {
      return new ProtectedArea(
        protected_area, 
        protected_area.organization, 
        new ProtectedAreaType(protected_area.type.protected_area_type_id, protected_area.type.description)
      );
    });
  }

  async findByDistance(applicationId: number, distance: number, typeId: number): Promise<ProtectedArea[]> {
    const ids = await this.prisma.$queryRaw<ProtectedArea[]>`SELECT distinct p.id FROM "protected_area" as p, "application_area" as a where ST_Intersects(p.geom , ST_Buffer(a.geom::geography , ${distance})) and p.protected_area_type_id = ${typeId} and a.application_id = ${applicationId}`;
        
    const protected_areas = await this.prisma.protectedArea.findMany({
      where: {
        id: { in: ids.map((item)=>item.id)}
      },
      include: {
        organization: true,
        type: true,
      }
    });

    return protected_areas.map((protected_area) => {
      return new ProtectedArea(
        protected_area, 
        protected_area.organization, 
        new ProtectedAreaType(protected_area.type.protected_area_type_id, protected_area.type.description)
      );
    });
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
        protected_area_type_id: typeId
      },
    });
  }

}
