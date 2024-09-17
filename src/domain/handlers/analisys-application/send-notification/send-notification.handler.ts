import { Inject, Injectable, Logger } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { IApplicationNotificationRepository } from '../../../../infra/prisma/repositories/application-notification.repository';
import { ApplicationAnalisysStatusEnum } from '../../../enums/application-analisys-status.enum';
import { ApplicationNotificationStatusEnum } from '../../../enums/application-notification-status.enum';
import { AnalisysApplicationContext } from '../analisys-application.context';
import { IApplicationAnalisysRepository } from '../../../../infra/prisma/repositories/application-analisys.repository';

@Injectable()
export class SendNotificationHandler extends AbstractHandler<AnalisysApplicationContext> {
  private readonly logger = new Logger(AbstractHandler.name);

  constructor(
    @Inject('IApplicationNotificationRepository')
    private notificationRepository: IApplicationNotificationRepository,
    @Inject('IApplicationAnalisysRepository')
    private analisysRepository: IApplicationAnalisysRepository,
  ) {
    super();
  }

  public async handle(context: AnalisysApplicationContext) {
    const analisys = await this.analisysRepository.findAll({
      application_id: context.applicationId,
      status: [ApplicationAnalisysStatusEnum.FAILED],
    });

    if (analisys.length) {
      await this.notificationRepository.create({
        userId: 1,
        status: ApplicationNotificationStatusEnum.Pending,
        fiscalId: this.getFiscal(context.applicationId),
        applicationId: context.applicationId,
      });

      this.logger.log('Notification has been created', context);
    }

    return super.handle(context);
  }

  private getFiscal(applicationId: bigint): number {
    // TODO: definir qual a regra para atribuir um fiscal
    console.log('applicationId => ', applicationId);
    return 1;
  }
}
