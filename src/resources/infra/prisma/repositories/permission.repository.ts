import { Permission } from './../../../../domain/entities/permission.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface IPermissionRepository {
  create(
    data: Partial<{
      resource: string;
      action: string;
      description: string;
      user_id: number;
    }>,
  ): Promise<Permission>;
  update(
    data: Partial<{
      permissionId: number;
      resource: string;
      action: string;
      description: string;
      user_id: number;
    }>,
  ): Promise<Permission>;
  findOne(permissionId: number): Promise<Permission>;
  findAll(
    params: Partial<{
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<Permission[]>;
}

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      resource: string;
      action: string;
      description: string;
      user_id: number;
    }>,
  ): Promise<Permission> {
    const permission = await this.prisma.permission.create({
      data: {
        resource: data.resource,
        action: data.action,
        description: data.description,
        created_by: data.user_id,
      },
    });
    return this.findOne(permission.permission_id);
  }

  async update(
    data: Partial<{
      permissionId: number;
      resource: string;
      action: string;
      description: string;
      user_id: number;
    }>,
  ): Promise<Permission> {
    const findPermission = await this.prisma.permission.findFirst({
      where: {
        permission_id: data.permissionId,
      },
    });

    const permission = await this.prisma.permission.create({
      data: {
        permission_id: data.permissionId,
        resource: data.resource,
        action: data.action,
        description: data.description,
        created_by: data.user_id,
      },
    });
    return this.findOne(permission.permission_id);
  }

  async findOne(permissionId: number): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        permission_id: permissionId,
      },
    });

    return new Permission(permission);
  }

  async findAll(
    params: Partial<{
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<Permission[]> {
    const page = params.page || 1;
    const take = params.pageSize || 10;
    const skip = (page - 1) * take;

    const permissions = await this.prisma.permission.findMany({
      where: {},
      skip,
      take,
    });

    return permissions.map((permission) => {
      return new Permission(permission);
    });
  }
}
