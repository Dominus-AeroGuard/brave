import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import { Prisma, Role as RoleModel } from '@prisma/client';
import { PaginableEntity } from '../../dtos/paginable.dto';
import { DateTime } from 'luxon';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto, createdBy: number): Promise<Role> {
    const { role, description } = createRoleDto;
    const exists = await this.prisma.role.count({ where: { role } });

    if (exists) {
      throw new ConflictException('Role já registrada');
    }

    const createdRole = await this.prisma.role.create({
      data: {
        description,
        role: role.toLowerCase(),
        created_by: createdBy,
      },
    });

    return this.buildRole(createdRole);
  }

  async findAll(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<PaginableEntity<Role>> {
    const query = { where: {} } as Prisma.RoleFindManyArgs;

    if (!!search) {
      query.where.OR = [
        { description: { contains: search } },
        { role: { contains: search } },
      ];
    }

    const skip = pageSize * (page - 1);

    const [count, roles] = await Promise.all([
      this.prisma.role.count({ where: query.where }),
      this.prisma.role.findMany({
        ...query,
        take: pageSize,
        skip,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return new PaginableEntity<Role>(
      roles.map((role) => this.buildRole(role)),
      {
        page,
        size: pageSize,
        countRecords: count,
      },
    );
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { role_id: id },
    });

    return this.buildRole(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const inUse = await this.prisma.userRole.count({
      where: {
        role_id: id,
      },
    });

    const data = {
      description: updateRoleDto.description,
    } as Role;

    if (!inUse) {
      data.role = updateRoleDto.role;
    }

    await this.prisma.role.update({
      where: {
        role_id: id,
      },
      data: {
        ...data,
        updated_at: DateTime.now().toJSDate(),
      },
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.prisma.role.update({
      where: {
        role_id: id,
      },
      data: {
        active: false,
      },
    });
  }

  buildRole(roleModel: RoleModel): Role {
    const {
      role_id,
      role,
      description,
      active,
      organization_id,
      created_at,
      updated_at,
    } = roleModel;

    return new Role(
      role_id,
      role,
      description,
      active,
      organization_id,
      created_at,
      updated_at,
    );
  }
}
