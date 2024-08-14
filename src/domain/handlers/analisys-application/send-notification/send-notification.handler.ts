import { Inject, Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { IApplicationNotificationRepository } from '../../../../infra/prisma/repositories/application-notification.repository';
import { ApplicationAnalisysStatusEnum } from '../../../enums/application-analisys-status.enum';
import { ApplicationNotificationStatusEnum } from '../../../enums/application-notification-status.enum';
import { AnalisysApplicationContext } from '../analisys-application.context';
import { IApplicationAnalisysRepository } from '../../../../infra/prisma/repositories/application-analisys.repository';

@Injectable()
export class SendNotificationHandler extends AbstractHandler<AnalisysApplicationContext> {
  constructor(
    @Inject('IApplicationNotificationRepository')
    private notificationRepository: IApplicationNotificationRepository,
    @Inject('IApplicationAnalisysRepository')
    private analisysRepository: IApplicationAnalisysRepository,
  ) {
    super();
  }

  public async handle() {
    const analisys = await this.analisysRepository.findAll(
      this.request.applicationId,
      {
        status: [ApplicationAnalisysStatusEnum.FAILED],
      },
    );

    if (analisys.length) {
      await this.notificationRepository.create({
        status: ApplicationNotificationStatusEnum.Pending,
        fiscalId: this.getFiscal(this.request.applicationId),
        applicationId: this.request.applicationId,
      });
    }

    return super.handle();
  }

  private getFiscal(applicationId: bigint): number {
    // TODO: definir qual a regra para atribuir um fiscal
    return 1;
  }
}
