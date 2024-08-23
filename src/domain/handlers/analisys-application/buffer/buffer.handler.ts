import { Inject, Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { AnalisysApplicationContext } from '../analisys-application.context';
import { ApplicationAnalisysStatusEnum } from 'src/domain/enums/application-analisys-status.enum';
import { ApplicationAnalisysTypeEnum } from 'src/domain/enums/application-analisys-type.enum';
import { IApplicationAnalisysRepository } from 'src/infra/prisma/repositories/application-analisys.repository';
import { IProtectedAreaRepository } from 'src/infra/prisma/repositories/protected-area.repository';
import { ProtectedArea } from 'src/domain/entities';
import { IProtectedAreaTypeRepository } from 'src/infra/prisma/repositories/protected-area-type.repository';

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
    
    await this.analisysRepository.create({
      applicationId: context.applicationId,
      elapsedTime:0,
      status: areas.length > 0 ? ApplicationAnalisysStatusEnum.FAILED : ApplicationAnalisysStatusEnum.APPROVED,
      type: ApplicationAnalisysTypeEnum.BUFFER,      
    });

    return super.handle(context);
  }
}
