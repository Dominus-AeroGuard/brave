import { Inject, Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { AnalisysApplicationContext } from '../analisys-application.context';
import { ApplicationAnalisysStatusEnum } from '../../../../domain/enums/application-analisys-status.enum';
import { ApplicationAnalisysTypeEnum } from '../../../../domain/enums/application-analisys-type.enum';
import { IApplicationAnalisysRepository } from '../../../../resources/infra/prisma/repositories/application-analisys.repository';
import { IProtectedAreaRepository } from '../../../../resources/infra/prisma/repositories/protected-area.repository';
import { ProtectedArea } from '../../../../domain/entities';
import { IProtectedAreaTypeRepository } from '../../../../resources/infra/prisma/repositories/protected-area-type.repository';
import { performance } from 'perf_hooks';
@Injectable()
export class BufferHandler extends AbstractHandler<AnalisysApplicationContext> {
  constructor(
    @Inject('IApplicationAnalisysRepository')
    private analisysRepository: IApplicationAnalisysRepository,
    @Inject('IProtectedAreaRepository')
    private protectedAreaRepository: IProtectedAreaRepository,
    @Inject('IProtectedAreaTypeRepository')
    private protectedAreaTypeRepository: IProtectedAreaTypeRepository,
  ) {
    super();
  }

  public async handle(context: AnalisysApplicationContext) {
    const start = performance.now();

    const areas: ProtectedArea[] = [];
    const protectedAreaTypes = await this.protectedAreaTypeRepository.findAll();

    for (const protectedAreaType of protectedAreaTypes) {
      await this.protectedAreaRepository
        .findByDistance(
          Number(context.applicationId),
          protectedAreaType.distance,
          protectedAreaType.id,
        )
        .then((resp) => {
          areas.push(...resp);
        });
    }

    const detail: { protectedAreaId: number; meters: number }[] = [];
    for (const finded_area of areas) {
      await this.protectedAreaRepository
        .getDistanceTo(finded_area.id, Number(context.applicationId))
        .then((distance) => {
          detail.push({
            protectedAreaId: finded_area.id,
            meters: finded_area.type.distance - distance[0].min,
          });
        });
    }

    const end = performance.now();

    await this.analisysRepository.create({
      applicationId: context.applicationId,
      details: JSON.stringify(detail),
      elapsedTime: end - start,
      status:
        areas.length > 0
          ? ApplicationAnalisysStatusEnum.FAILED
          : ApplicationAnalisysStatusEnum.APPROVED,
      type: ApplicationAnalisysTypeEnum.BUFFER,
    });

    return super.handle(context);
  }
}
