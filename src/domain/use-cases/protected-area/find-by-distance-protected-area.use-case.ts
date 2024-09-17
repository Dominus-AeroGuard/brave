import { Inject, Injectable } from '@nestjs/common';
import { ProtectedArea } from '../../../domain/entities/protected-area.entity';
import { ProtectedAreaTypeEnum } from '../../../domain/enums/protected-area-type.enum';
import { IProtectedAreaRepository } from '../../../resources/infra/prisma/repositories/protected-area.repository';

@Injectable()
export class FindByDistanceProtectedAreaUseCase {
  constructor(
    @Inject('IProtectedAreaRepository')
    private protectedAreaRepository: IProtectedAreaRepository,
  ) {}

  async execute(
    params: Partial<{
      applicationId: number;
      distance: number;
      typeId: ProtectedAreaTypeEnum;
    }>,
  ): Promise<ProtectedArea[]> {
    return await this.protectedAreaRepository.findByDistance(
      params.applicationId,
      params.distance,
      params.typeId,
    );
  }
}
