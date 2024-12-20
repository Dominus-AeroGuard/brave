import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../resources/infra/prisma/prisma.service';
import { AuthResponse } from 'src/controllers/auth/models/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        userPermissions: {
          where: {
            permission: {
              active: true,
            },
          },
          include: {
            permission: {
              select: { action: true, resource: true },
            },
          },
        },
        userRoles: {
          where: {
            role: {
              active: true,
            },
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: {
                      select: { action: true, resource: true },
                    },
                  },
                },
              },
            },
          },
        },
        organizations: {
          select: {
            organization_id: true,
            organization: {
              select: { organization_id: true, name: true },
            },
          },
        },
        user_id: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const organizations = user.organizations.map(
      ({ organization: { organization_id: id, name } }) => ({
        id,
        name,
      }),
    );
    const roles = user.userRoles.map((userRole) => userRole.role.role);
    const permissions = user.userPermissions.map(
      (userPermission) =>
        `${userPermission.permission.resource}:${userPermission.permission.action}`,
    );

    const payload = {
      sub: user.user_id,
      email: user.email,
      organizations,
      roles,
      permissions,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
    };
  }

  async signInOrganization(
    userId: number,
    organizationId: number,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: { user_id: userId },
      select: {
        userPermissions: {
          where: {
            permission: {
              active: true,
            },
          },
          include: {
            permission: {
              select: { action: true, resource: true },
            },
          },
        },
        userRoles: {
          where: {
            role: {
              active: true,
            },
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: {
                      select: { action: true, resource: true },
                    },
                  },
                },
              },
            },
          },
        },
        organizations: {
          select: {
            organization_id: true,
            organization: {
              select: { organization_id: true, name: true },
            },
          },
        },
        user_id: true,
        email: true,
      },
    });

    const hasOrganizationAccess = user.organizations.some(
      ({ organization: { organization_id } }) =>
        organizationId === organization_id,
    );

    if (!hasOrganizationAccess) {
      throw new ForbiddenException({
        message: 'Usuário sem acesso a essa organização',
      });
    }

    const organizations = user.organizations.map(
      ({ organization: { organization_id: id, name } }) => ({
        id,
        name,
      }),
    );

    const roles = user.userRoles.map((userRole) => userRole.role.role);
    const permissions = user.userPermissions.map(
      (userPermission) =>
        `${userPermission.permission.resource}:${userPermission.permission.action}`,
    );

    const rolePermissions = this.buildRolePermissions(user.userRoles);

    const payload = {
      sub: user.user_id,
      orgId: organizationId,
      email: user.email,
      organizations,
      roles: [...roles],
      permissions: [...permissions, ...rolePermissions],
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
    };
  }

  private buildRolePermissions(roles) {
    return roles.reduce((prev, role) => {
      return [
        ...prev,
        ...role.role.rolePermissions.map(
          (rp) => `${rp.permission.resource}:${rp.permission.action}`,
        ),
      ];
    }, []);
  }
}
