import { Inject, Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { AnalisysApplicationContext } from '../analisys-application.context';
import { IApplicationAnalisysRepository } from '../../../../resources/infra/prisma/repositories/application-analisys.repository';
import { ApplicationAnalisysStatusEnum } from '../../../../domain/enums/application-analisys-status.enum';
import { ApplicationAnalisysTypeEnum } from '../../../../domain/enums/application-analisys-type.enum';

@Injectable()
export class WeatherHandler extends AbstractHandler<AnalisysApplicationContext> {
  constructor(
    @Inject('IApplicationAnalisysRepository')
    private analisysRepository: IApplicationAnalisysRepository,
  ) {
    super();
  }

  public async handle(context: AnalisysApplicationContext) {
    await this.analisysRepository.create({
      applicationId: context.applicationId,
      elapsedTime: 0,
      status: ApplicationAnalisysStatusEnum.FAILED,
      type: ApplicationAnalisysTypeEnum.CLIMA,
    });

    return super.handle(context);
  }
}
