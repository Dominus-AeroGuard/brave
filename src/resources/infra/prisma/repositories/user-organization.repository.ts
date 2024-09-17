import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserOrganization as UserOrganization } from '../../../../domain/entities';

export interface IUserOrganizationRepository {
  create(
    data: Partial<{
      user_id: number;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
    }>,
  ): Promise<UserOrganization>;
  findOne(organizationId: number, userId: number): Promise<UserOrganization>;
  findAll(
    params: Partial<{
      organizationId: number;
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<UserOrganization[]>;
  remove(
    data: Partial<{
      user_id: number;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
    }>,
  ): Promise<void>;
}

@Injectable()
export class UserOrganizationRepository implements IUserOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      user_id: number;
      organization: Partial<{
        id: number;
      }>;
      user: Partial<{
        id: number;
      }>;
    }>,
  ): Promise<UserOrganization> {
    const userOrganization = await this.prisma.userOrganization.create({
      data: {
        updated_by: data.user.id.toString(),
        created_by: data.user.id.toString(),
        user: {
          connect: {
            user_id: data.user_id,
          },
        },
        organization: {
          connect: { organization_id: data.organization.id },
        },
      },
    });

    return this.findOne(data.organization.id, userOrganization.user_id);
  }

  async findOne(
    organizationId: number,
    userId: number,
  ): Promise<UserOrganization> {
    const userOrganization = await this.prisma.userOrganization.findUnique({
      where: {
        user_id_organization_id: {
          user_id: userId,
          organization_id: organizationId,
        },
      },
      include: {
        user: true,
        organization: true,
      },
    });

    return new UserOrganization(userOrganization, userOrganization.user);
  }

  async findAll(
    params: Partial<{
      organizationId: number;
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<UserOrganization[]> {
    const page = params.page || 1;
    const take = params.pageSize || 10;
    const skip = (page - 1) * take;

    const usersOrganizations = await this.prisma.userOrganization.findMany({
      where: {
        organization_id: params.organizationId,
        active: true,
      },
      include: {
        user: true,
      },
      skip,
      take,
    });

    return usersOrganizations.map((userOrganization) => {
      return new UserOrganization(userOrganization, userOrganization.user);
    });
  }

  async remove(
    data: Partial<{
      user_id: number;
      organization: Partial<{
        id: number;
      }>;
      user: Partial<{
        id: number;
      }>;
    }>,
  ) {
    await this.prisma.userOrganization.update({
      where: {
        user_id_organization_id: {
          user_id: data.user_id,
          organization_id: data.organization.id,
        },
      },
      data: {
        updated_by: data.user.id.toString(),
        updated_at: new Date(),
        active: false,
      },
    });
  }
}
