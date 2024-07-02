import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { Application as Application } from '../../../domain/entities';
import { DateTime } from 'luxon';
import { ApplicationStatus } from '../../../domain/enums/application-status.enum';

export interface IApplicationRepository {
  create(
    data: Partial<{
      vehicle: string;
      startDate: string;
      endDate: string;
      pilot: Partial<{ id: number }>;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
    }>,
  ): Promise<Application>;
  findOne(organizationId: number, id: string): Promise<Application>;
  update(
    data: Partial<{
      id: string;
      organization: Partial<{ id: number }>;
      userId: Partial<{ id: number }>;
      vehicle?: string;
      pilot?: Partial<{ id?: number }>;
      status?: Partial<{ id?: number }>;
    }>,
  ): Promise<Application>;
  remove(organizationId: number, id: string): Promise<void>;
  findAll(
    params: Partial<{
      organizationId: number;
      id?: string;
      pilotId?: number[];
      statusId?: number[];
      userId?: number[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<Application[]>;
}

@Injectable()
export class ApplicationRepository implements IApplicationRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      vehicle: string;
      startDate: string;
      endDate: string;
      pilot: Partial<{
        id: number;
      }>;
      organization: Partial<{
        id: number;
      }>;
      user: Partial<{
        id: number;
      }>;
    }>,
  ): Promise<Application> {
    const startDate = DateTime.fromISO(data.startDate)
      .setZone('America/Sao_Paulo')
      .toISO();
    const endDate = DateTime.fromISO(data.endDate)
      .setZone('America/Sao_Paulo')
      .toISO();

    const application = await this.prisma.application.create({
      data: {
        start_date: startDate,
        end_date: endDate,
        vehicle: data.vehicle,
        created_by: data.user.id.toString(),
        events: {
          create: {
            created_by: data.user.id.toString(),
            application_status_id: ApplicationStatus.Planning,
            pilot_id: Number(data.pilot.id),
          },
        },
        user: {
          connect: {
            user_id: data.user.id,
          },
        },
        organization: {
          connect: { organization_id: data.organization.id },
        },
      },
    });

    return this.findOne(
      data.organization.id,
      application.application_id.toString(),
    );
  }

  async findOne(organizationId: number, id: string): Promise<Application> {
    const application = await this.prisma.application.findUnique({
      where: {
        organization_id: organizationId,
        application_id: BigInt(id),
      },
      include: {
        user: true,
        organization: true,
        events: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          include: {
            status: true,
            pilot: true,
          },
        },
      },
    });

    return new Application(
      application,
      application.events[0],
      application.user,
      application.organization,
      application.events[0].pilot,
      application.events[0].status,
    );
  }

  async update(
    data: Partial<{
      id: string;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
      vehicle?: string;
      pilot?: Partial<{ id?: number }>;
      status?: Partial<{ id?: number }>;
    }>,
  ): Promise<Application> {
    const lastEvent = await this.prisma.applicationEvent.findFirst({
      where: {
        application_id: BigInt(data.id),
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    await this.prisma.applicationEvent.create({
      data: {
        created_by: data.user.id.toString(),
        status: {
          connect: {
            application_status_id:
              data.status?.id ?? lastEvent.application_status_id,
          },
        },
        pilot: {
          connect: {
            pilot_id: data.pilot?.id ?? lastEvent.pilot_id,
          },
        },
        application: {
          connect: {
            application_id: Number(data.id),
          },
        },
      },
    });

    return this.findOne(data.organization.id, data.id);
  }

  async remove(organizationId: number, id: string) {
    this.prisma.application.delete({
      where: { application_id: BigInt(id), organization_id: organizationId },
    });
  }

  async findAll(
    params: Partial<{
      organizationId: number;
      id?: string;
      pilotId?: number[];
      statusId?: number[];
      userId?: number[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<Application[]> {
    const page = params.page || 1;
    const take = params.pageSize || 10;
    const skip = (page - 1) * take;

    const applications = await this.prisma.application.findMany({
      where: {
        organization_id: params.organizationId,
      },
      include: {
        user: true,
        organization: true,
        events: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          include: {
            status: true,
            pilot: true,
          },
        },
      },
      skip,
      take,
    });

    return applications.map((application) => {
      return new Application(
        application,
        application.events[0],
        application.user,
        application.organization,
        application.events[0].pilot,
        application.events[0].status,
      );
    });
  }
}
