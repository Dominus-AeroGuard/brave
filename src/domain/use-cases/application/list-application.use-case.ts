import { Inject, Injectable } from '@nestjs/common';
import { PaginableEntity } from '../../../controllers/dtos/paginable.dto';
import { Application } from '../../../domain/entities';
import { IApplicationRepository } from '../../../infra/prisma/repositories/application.repository';

@Injectable()
export class ListApplicationUseCase {
  constructor(
    @Inject('IApplicationRepository')
    private applicationRepository: IApplicationRepository,
  ) {}

  async execute(
    params: Partial<{
      id: string;
      organizationId: number;
      pilotId?: number[];
      statusId?: number[];
      userId?: number[];
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<PaginableEntity<Application>> {
    const result = await this.applicationRepository.findAll(params);

    return new PaginableEntity<Application>(result, {
      page: params.page,
      size: params.pageSize,
    });
  }
}
