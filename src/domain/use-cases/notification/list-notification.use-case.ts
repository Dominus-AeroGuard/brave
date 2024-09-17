import { Inject, Injectable } from '@nestjs/common';
import { PaginableEntity } from '../../../controllers/dtos/paginable.dto';
import { ApplicationNotificationRepository } from '../../../resources/infra/prisma/repositories/application-notification.repository';
import { ApplicationNotification } from '../../../domain/entities/application-notification.entity';

export interface ListNotificationRequest {
  query: Partial<{
    applicationId?: bigint[];
    statusId?: number[];
    fiscalId?: number[];
    page?: number;
    size?: number;
  }>;
}

@Injectable()
export class ListNotificationUseCase {
  constructor(
    @Inject('IApplicationNotificationRepository')
    private notificationRepository: ApplicationNotificationRepository,
  ) {}

  async execute(
    request: ListNotificationRequest,
  ): Promise<PaginableEntity<ApplicationNotification>> {
    const { query } = request;
    const result = await this.notificationRepository.findAll(query);

    return new PaginableEntity<ApplicationNotification>(result, {
      page: query.page,
      size: query.size,
    });
  }
}
