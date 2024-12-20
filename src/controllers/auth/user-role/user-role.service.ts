import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { PrismaService } from '../../../resources/infra/prisma/prisma.service';
import { UserRole } from './entities/user-role.entity';
import { DateTime } from 'luxon';

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}
  async create(
    userId: number,
    createUserRoleDto: CreateUserRoleDto,
    createdBy: number,
  ) {
    const hasOrganizationRoles = await this.prisma.role.count({
      where: {
        organization_id: {
          not: null,
        },
        role_id: {
          in: createUserRoleDto.data,
        },
      },
    });

    if (hasOrganizationRoles) {
      throw new UnprocessableEntityException(
        'Usuários administrativos não são permitidos associar uma role de uma organização.',
      );
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: {
        user_id: userId,
        removed_at: null,
        role_id: {
          in: createUserRoleDto.data,
        },
      },
      select: {
        role_id: true,
      },
    });

    const createUserRoles = createUserRoleDto.data.filter(
      (roleId) => !userRoles.some(({ role_id }) => role_id === roleId),
    );

    await this.prisma.userRole.createMany({
      data: createUserRoles.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
        created_by: createdBy,
      })),
    });

    return this.findAll(userId);
  }

  async findAll(userId: number): Promise<Array<UserRole>> {
    const roles = await this.prisma.userRole.findMany({
      where: {
        user_id: userId,
        removed_at: null,
      },
      include: {
        role: {
          select: {
            role_id: true,
            role: true,
            organization_id: true,
          },
        },
      },
    });

    return roles.map(
      ({ role: { role_id, role, organization_id } }) =>
        new UserRole(role_id, role, organization_id),
    );
  }

  async findOne(userid: number, roleid: number): Promise<UserRole> {
    const userRole = await this.getUserRole(userid, roleid);

    if (!userRole) {
      throw new NotFoundException('Role não encontrado para o usuário');
    }

    return new UserRole(
      userRole.role.role_id,
      userRole.role.role,
      userRole.role.organization_id,
    );
  }

  async remove(userid: number, roleid: number) {
    const userRole = await this.getUserRole(userid, roleid);

    if (!userRole) {
      throw new NotFoundException('Role não encontrado para o usuário');
    }

    return this.prisma.userRole.update({
      data: {
        removed_at: DateTime.utc().toString(),
      },
      where: {
        user_role_id: userRole.user_role_id,
      },
    });
  }

  private getUserRole(userid: number, roleid: number) {
    return this.prisma.userRole.findFirst({
      where: {
        role_id: roleid,
        user_id: userid,
        removed_at: null,
      },
      include: {
        role: {
          select: {
            role_id: true,
            role: true,
            organization_id: true,
          },
        },
      },
    });
  }
}
