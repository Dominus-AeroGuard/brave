import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';

import { ApplicationAnalisys } from '../../../domain/entities/application-analisys.entity';
import { ApplicationAnalisysTypeEnum } from '../../../domain/enums/application-analisys-type.enum';
import { ApplicationAnalisysStatusEnum } from '../../../domain/enums/application-analisys-status.enum';

export interface IApplicationAnalisysRepository {
  create(
    data: Partial<{
      applicationId: bigint;
      elapsedTime: number;
      details?: string;
      status: ApplicationAnalisysStatusEnum;
      type: ApplicationAnalisysTypeEnum;
    }>,
  ): Promise<ApplicationAnalisys>;
  findOne(id: number): Promise<ApplicationAnalisys>;
  update(
    id: number,
    data: Partial<{
      elapsedTime: number;
      details?: string;
      status: ApplicationAnalisysStatusEnum;
      type: ApplicationAnalisysTypeEnum;
      fiscalId: number;
    }>,
  ): Promise<ApplicationAnalisys>;
  remove(notificationId: number): Promise<void>;
  findAll(
    params: Partial<{
      application_id?: bigint;
      notification_id?: bigint;
      status?: ApplicationAnalisysStatusEnum[];
      typeId?: ApplicationAnalisysTypeEnum[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<ApplicationAnalisys[]>;
}

@Injectable()
export class ApplicationAnalisysRepository
  implements IApplicationAnalisysRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    data: Partial<{
      applicationId: bigint;
      elapsedTime: number;
      details?: string;
      status: ApplicationAnalisysStatusEnum;
      type: ApplicationAnalisysTypeEnum;
    }>,
  ): Promise<ApplicationAnalisys> {
    const analisys = await this.prisma.applicationAnalisys.create({
      data: {
        elapsed_time: data.elapsedTime,
        details: data.details,
        status: data.status,
        type: {
          connect: {
            application_analisys_type_id: data.type,
          },
        },
        application: {
          connect: { application_id: data.applicationId },
        },
      },
      select: {
        application_analisys_id: true,
      },
    });

    return this.findOne(analisys.application_analisys_id);
  }

  async findOne(id: number): Promise<ApplicationAnalisys> {
    const analisy = await this.prisma.applicationAnalisys.findUnique({
      where: {
        application_analisys_id: id,
      },
      include: {
        type: true,
      },
    });

    return new ApplicationAnalisys(
      analisy.application_analisys_id,
      analisy.elapsed_time,
      analisy.type.name,
      analisy.details?.toString(),
      analisy.status as ApplicationAnalisysStatusEnum,
      analisy.created_at,
    );
  }

  async update(
    id: number,
    data: Partial<{
      elapsedTime: number;
      details?: string;
      status: ApplicationAnalisysStatusEnum;
      type: ApplicationAnalisysTypeEnum;
      fiscalId: number;
    }>,
  ): Promise<ApplicationAnalisys> {
    await this.prisma.applicationAnalisys.update({
      where: {
        application_analisys_id: id,
      },
      data: {
        elapsed_time: data.elapsedTime,
        details: data.details,
        status: data.status,
      },
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    this.prisma.applicationAnalisys.delete({
      where: { application_analisys_id: id },
    });
  }

  async findAll(
    params: Partial<{
      application_id?: bigint;
      notification_id?: bigint;
      status?: ApplicationAnalisysStatusEnum[];
      typeId?: ApplicationAnalisysTypeEnum[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<ApplicationAnalisys[]> {
    const page = params.page || 1;
    const take = params.pageSize || 10;
    const skip = (page - 1) * take;

    const analisys = await this.prisma.applicationAnalisys.findMany({
      where: {
        status: {
          in: params.status,
        },
        application_notification_id: params.notification_id,
        application_id: params.application_id,
        application_analisys_type_id: {
          in: params.typeId,
        },
      },
      include: {
        type: true,
      },
      skip,
      take,
    });

    return analisys.map(
      (analisy) =>
        new ApplicationAnalisys(
          analisy.application_analisys_id,
          analisy.elapsed_time,
          analisy.type.name,
          analisy.details?.toString(),
          analisy.status as ApplicationAnalisysStatusEnum,
          analisy.created_at,
        ),
    );
  }
}
