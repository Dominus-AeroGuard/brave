import { Inject, Injectable } from '@nestjs/common';
import { PaginableEntity } from '../../../controllers/dtos/paginable.dto';
import { Application } from '../../../domain/entities';
import { IApplicationRepository } from '../../../infra/prisma/repositories/application.repository';

export interface ListApplicationRequest {
  organizationId: number;
  id?: string;
  pilotId?: number[];
  statusId?: number[];
  userId?: number[];
  page?: number;
  pageSize?: number;
}

@Injectable()
export class ListApplicationUseCase {
  constructor(
    @Inject('IApplicationRepository')
    private applicationRepository: IApplicationRepository,
  ) {}

  async execute(
    request: ListApplicationRequest,
  ): Promise<PaginableEntity<Application>> {
    const result = await this.applicationRepository.findAll(request);

    return new PaginableEntity<Application>(result, {
      page: request.page,
      size: request.pageSize,
    });
  }
}
