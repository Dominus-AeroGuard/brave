import { Inject, Injectable } from '@nestjs/common';
import { ApplicationNotificationRepository } from '../../../infra/prisma/repositories/application-notification.repository';
import { AnalysisBuffer } from 'src/domain/entities/analysis-buffer.entity';
import { ApplicationAreaRepository } from 'src/infra/prisma/repositories/application-area.repository';
import { ProtectedAreaRepository } from 'src/infra/prisma/repositories/protected-area.repository';

@Injectable()
export class NotificationBufferUseCase {
  constructor(
    @Inject('IApplicationNotificationRepository')
    private notificationRepository: ApplicationNotificationRepository,
    @Inject('IApplicationAreaRepository')
    private applicationAreaRepository: ApplicationAreaRepository,
    @Inject('IProtectedAreaRepository')
    private protectedAreaRepository: ProtectedAreaRepository,
    
  ) {}

  async execute(
    notificationId: bigint, 
    analysisId: number,
  ): Promise<AnalysisBuffer>  {
    const notification = await this.notificationRepository.findOne(notificationId);
    const analysis = await notification.analisys.filter(a => a.id == analysisId);

    const application_id = notification.application.id;
    const applicationGEOJSON = await this.applicationAreaRepository.getAsGeoJson(Number(application_id));

    const details = analysis[0].details.toString();
    const detailsArray = JSON.parse(details);
    
    const protectedAreaGEOJSON = await this.protectedAreaRepository.getAsGeoJson(detailsArray.map(item => item.protectedAreaId));

    const protectedAreaBufferGEOJSON = await this.protectedAreaRepository.getWithBufferAsGeoJson(detailsArray.map(item => item.protectedAreaId));
    

    return new AnalysisBuffer(
      notificationId,
      analysisId,
      applicationGEOJSON,
      protectedAreaGEOJSON,
      protectedAreaBufferGEOJSON
    );

  }
}
