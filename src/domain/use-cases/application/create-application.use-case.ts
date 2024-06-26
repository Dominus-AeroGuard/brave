import { Inject, Injectable } from '@nestjs/common';
import { Application } from 'src/domain/entities';
import { IApplicationRepository } from 'src/infra/prisma/repositories/application.repository';

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject('IApplicationRepository')
    private applicationRepository: IApplicationRepository,
  ) {}

  execute(
    data: Partial<{
      organization: Partial<{
        id: number;
      }>;
      user: Partial<{
        id: number;
      }>;
      vehicle: string;
      startDate: string;
      endDate: string;
      pilot: Partial<{
        id: number;
      }>;
    }>,
  ): Promise<Application> {
    return this.applicationRepository.create(data);
  }
}
