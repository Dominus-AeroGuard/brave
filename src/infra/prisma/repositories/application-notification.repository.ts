import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { User } from '../../../domain/entities';
import { ApplicationNotificationStatusEnum } from '../../../domain/enums/application-notification-status.enum';
import {
  ApplicationNotification,
  ApplicationNotificationStatus,
} from '../../../domain/entities/application-notification.entity';
import { ApplicationAnalisys } from '../../../domain/entities/application-analisys.entity';
import { ApplicationAnalisysStatusEnum } from '../../../domain/enums/application-analisys-status.enum';

export interface IApplicationNotificationRepository {
  create(
    data: Partial<{
      userId?: number;
      status: ApplicationNotificationStatusEnum;
      applicationId: bigint;
      fiscalId: number;
    }>,
  ): Promise<ApplicationNotification>;
  findOne(notificationId: bigint): Promise<ApplicationNotification>;
  update(
    id: bigint,
    data: Partial<{
      userId: number;
      statusId?: number;
    }>,
  ): Promise<ApplicationNotification>;
  remove(notificationId: bigint): Promise<void>;
  findAll(
    params: Partial<{
      applicationId?: bigint[];
      statusId?: number[];
      fiscalId?: number[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<ApplicationNotification[]>;
}

@Injectable()
export class ApplicationNotificationRepository
  implements IApplicationNotificationRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      userId: number;
      status: number;
      applicationId: bigint;
      fiscalId: number;
    }>,
  ): Promise<ApplicationNotification> {
    const analisys = await this.prisma.applicationAnalisys.findMany({
      where: {
        application_id: data.applicationId,
      },
      select: {
        application_analisys_id: true,
      },
    });

    const applicationNotification =
      await this.prisma.applicationNotification.create({
        data: {
          events: {
            create: {
              created_by: data.userId.toString(),
              status: {
                connect: {
                  id: data.status,
                },
              },
            },
          },
          fiscal: {
            connect: {
              user_id: data.fiscalId,
            },
          },
          application: {
            connect: { application_id: data.applicationId },
          },
          analisys: {
            connect: analisys,
          },
        },
        select: {
          application_notification_id: true,
        },
      });

    return this.findOne(applicationNotification.application_notification_id);
  }

  async findOne(notificationId: bigint): Promise<ApplicationNotification> {
    const notification = await this.prisma.applicationNotification.findUnique({
      where: {
        application_notification_id: notificationId,
      },
      include: {
        fiscal: true,
        application: {
          select: {
            application_id: true,
          },
        },
        analisys: {
          include: {
            type: true,
          },
        },
        events: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          include: {
            status: true,
          },
        },
      },
    });

    return new ApplicationNotification(
      new User(notification.fiscal),
      notification.application.application_id,
      new ApplicationNotificationStatus(
        notification.events[0].status.id,
        notification.events[0].status.description,
      ),
      notification.analisys.map(
        (analisy) =>
          new ApplicationAnalisys(
            analisy.elapsed_time,
            analisy.type.name,
            analisy.status as ApplicationAnalisysStatusEnum,
            analisy.created_at,
          ),
      ),
    );
  }

  async update(
    id: bigint,
    data: Partial<{
      userId: number;
      statusId?: number;
    }>,
  ): Promise<ApplicationNotification> {
    await this.prisma.applicationNotificationEvent.create({
      data: {
        created_by: data.userId.toString(),
        status: {
          connect: {
            id: data.statusId,
          },
        },
        notification: {
          connect: {
            application_notification_id: id,
          },
        },
      },
    });

    return this.findOne(id);
  }

  async remove(id: bigint) {
    this.prisma.applicationNotification.delete({
      where: { application_notification_id: BigInt(id) },
    });
  }

  async findAll(
    params: Partial<{
      applicationId?: bigint[];
      statusId?: number[];
      fiscalId?: number[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<ApplicationNotification[]> {
    const page = params.page || 1;
    const take = params.pageSize || 10;
    const skip = (page - 1) * take;

    const notifications = await this.prisma.applicationNotification.findMany({
      where: {
        fiscal_id: {
          in: params.fiscalId,
        },
        events: {
          some: {
            application_notification_status_id: {
              in: params.statusId,
            },
          },
        },
      },
      include: {
        fiscal: true,
        application: {
          select: {
            application_id: true,
          },
        },
        analisys: {
          include: {
            type: true,
          },
        },
        events: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          include: {
            status: true,
          },
        },
      },
      skip,
      take,
    });

    return notifications.map(
      (notification) =>
        new ApplicationNotification(
          new User(notification.fiscal),
          notification.application.application_id,
          new ApplicationNotificationStatus(
            notification.events[0].status.id,
            notification.events[0].status.description,
          ),
          notification.analisys.map(
            (analisy) =>
              new ApplicationAnalisys(
                analisy.elapsed_time,
                analisy.type.name,
                analisy.status as ApplicationAnalisysStatusEnum,
                analisy.created_at,
              ),
          ),
        ),
    );
  }
}
