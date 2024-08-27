import { Inject, Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { AnalisysApplicationContext } from '../analisys-application.context';
import { ApplicationAnalisysStatusEnum } from '../../../../domain/enums/application-analisys-status.enum';
import { ApplicationAnalisysTypeEnum } from '../../../../domain/enums/application-analisys-type.enum';
import { IApplicationAnalisysRepository } from '../../../../infra/prisma/repositories/application-analisys.repository';
import { IProtectedAreaRepository } from '../../../../infra/prisma/repositories/protected-area.repository';
import { ProtectedArea } from '../../../../domain/entities';
import { IProtectedAreaTypeRepository } from '../../../../infra/prisma/repositories/protected-area-type.repository';
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

    let areas : ProtectedArea[] = [];
    const protectedAreaTypes = await this.protectedAreaTypeRepository.findAll();
    for (const protectedAreaType of protectedAreaTypes){
      await this.protectedAreaRepository.findByDistance(
        Number(context.applicationId),
        protectedAreaType.distance,
        protectedAreaType.id,
      ).then(resp => {
        areas.push(... resp);
      });
    }

    const end = performance.now();

    await this.analisysRepository.create({
      applicationId: context.applicationId,
      elapsedTime: end - start,
      status: areas.length > 0 ? ApplicationAnalisysStatusEnum.FAILED : ApplicationAnalisysStatusEnum.APPROVED,
      type: ApplicationAnalisysTypeEnum.BUFFER,      
    });

    return super.handle(context);
  }
}
