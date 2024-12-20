import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApplicationNotificationRepository } from '../../../resources/infra/prisma/repositories/application-notification.repository';
import { AnalysisBuffer } from '../../../domain/entities/analysis-buffer.entity';
import { ApplicationAreaRepository } from '../../../resources/infra/prisma/repositories/application-area.repository';
import { ProtectedAreaRepository } from '../../../resources/infra/prisma/repositories/protected-area.repository';
import { ApplicationAnalisysTypeEnum } from '../../../domain/enums/application-analisys-type.enum';
import { AnalisysBufferDetail } from '../../../domain/entities/application-analisys.entity';
import { ApplicationPathRepository } from '../../../resources/infra/prisma/repositories/application-path.repository';

@Injectable()
export class NotificationBufferUseCase {
  constructor(
    @Inject('IApplicationNotificationRepository')
    private notificationRepository: ApplicationNotificationRepository,
    @Inject('IApplicationAreaRepository')
    private applicationAreaRepository: ApplicationAreaRepository,
    @Inject('IApplicationPathRepository')
    private applicationPathRepository: ApplicationPathRepository,
    @Inject('IProtectedAreaRepository')
    private protectedAreaRepository: ProtectedAreaRepository,
  ) {}

  async execute(
    notificationId: bigint,
    analysisId: number,
  ): Promise<AnalysisBuffer> {
    const notification =
      await this.notificationRepository.findOne(notificationId);

    const analysis = await notification.analisys.find(
      (a) =>
        a.id == analysisId &&
        ApplicationAnalisysTypeEnum[a.type.name] ===
          ApplicationAnalisysTypeEnum.BUFFER,
    );

    if (!analysis)
      throw new UnprocessableEntityException(
        'Não existe análise para essa notificação',
      );

    const application_id = notification.application.id;
    const details = analysis.details as Array<AnalisysBufferDetail>;

    const applicationGEOJSON =
      await this.applicationAreaRepository.getAsGeoJson(Number(application_id));

    const applicationPathGEOJSON =
      await this.applicationPathRepository.getAsGeoJson(Number(application_id));

    const protectedAreaGEOJSON =
      await this.protectedAreaRepository.getAsGeoJson(
        details.map((item) => item.protectedAreaId),
      );

    const protectedAreaBufferGEOJSON =
      await this.protectedAreaRepository.getWithBufferAsGeoJson(
        details.map((item) => item.protectedAreaId),
      );

    return new AnalysisBuffer(
      notificationId,
      analysisId,
      applicationGEOJSON,
      applicationPathGEOJSON,
      protectedAreaGEOJSON,
      protectedAreaBufferGEOJSON,
    );
  }
}
