import { Inject, Injectable } from '@nestjs/common';
import { Application } from '../../../domain/entities';
import { IApplicationRepository } from '../../../infra/prisma/repositories/application.repository';

@Injectable()
export class UpdateApplicationUseCase {
  constructor(
    @Inject('IApplicationRepository')
    private applicationRepository: IApplicationRepository,
  ) {}

  execute(
    data: Partial<{
      id: string;
      vehicle: string;
      pilot: Partial<{ id: number }>;
      status: Partial<{ id: number }>;
      organization: Partial<{ id: number }>;
      user: Partial<{ id: number }>;
    }>,
  ): Promise<Application> {
    return this.applicationRepository.update(data);
  }
}
