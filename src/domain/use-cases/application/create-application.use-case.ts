import { Inject, Injectable } from '@nestjs/common';
import { Application } from '../../../domain/entities';
import { IApplicationRepository } from '../../../resources/infra/prisma/repositories/application.repository';

export interface CreatApplicationRequest {
  organization: {
    id: number;
  };
  user: {
    id: number;
  };
  vehicle: string;
  startDate: string;
  endDate: string;
  pilot: {
    id: number;
  };
}

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject('IApplicationRepository')
    private applicationRepository: IApplicationRepository,
  ) {}

  execute(data: CreatApplicationRequest): Promise<Application> {
    return this.applicationRepository.create(data);
  }
}
