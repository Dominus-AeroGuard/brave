import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import { Prisma, Permission as PermissionModel } from '@prisma/client';
import { PaginableEntity } from '../../dtos/paginable.dto';
import { DateTime } from 'luxon';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}
  async create(
    createPermissionDto: CreatePermissionDto,
    createdBy: number,
  ): Promise<Permission> {
    const { resource, action, description } = createPermissionDto;
    const exists = await this.prisma.permission.count({
      where: { resource, action },
    });

    if (exists) {
      throw new ConflictException('Permission já registrada');
    }

    const createdPermission = await this.prisma.permission.create({
      data: {
        description,
        resource: resource.toLowerCase(),
        action: action.toLowerCase(),
        created_by: createdBy,
      },
    });

    return this.buildPermission(createdPermission);
  }

  async findAll(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<PaginableEntity<Permission>> {
    const query = { where: {} } as Prisma.PermissionFindManyArgs;

    if (!!search) {
      query.where.OR = [
        { description: { contains: search } },
        { resource: { contains: search } },
        { action: { contains: search } },
      ];
    }

    const skip = pageSize * (page - 1);

    const [count, permissions] = await Promise.all([
      this.prisma.permission.count({ where: query.where }),
      this.prisma.permission.findMany({
        ...query,
        take: pageSize,
        skip,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return new PaginableEntity<Permission>(
      permissions.map((permission) => this.buildPermission(permission)),
      {
        page,
        size: pageSize,
        countRecords: count,
      },
    );
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.prisma.permission.findUniqueOrThrow({
      where: { permission_id: id },
    });

    return this.buildPermission(permission);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const inUse = await this.prisma.userPermission.count({
      where: {
        permission_id: id,
      },
    });

    const data = {
      description: updatePermissionDto.description,
    } as Permission;

    if (!inUse) {
      data.resource = updatePermissionDto.resource;
      data.action = updatePermissionDto.action;
    }

    await this.prisma.permission.update({
      where: {
        permission_id: id,
      },
      data: {
        ...data,
        updated_at: DateTime.now().toJSDate(),
      },
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.prisma.permission.update({
      where: {
        permission_id: id,
      },
      data: {
        active: false,
      },
    });
  }

  buildPermission(permissionModel: PermissionModel): Permission {
    const {
      permission_id,
      resource,
      action,
      description,
      active,
      organization_permission,
      created_at,
      updated_at,
    } = permissionModel;

    return new Permission(
      permission_id,
      resource,
      action,
      description,
      active,
      organization_permission,
      created_at,
      updated_at,
    );
  }
}
