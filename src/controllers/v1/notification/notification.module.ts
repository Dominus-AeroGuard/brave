import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ListNotificationUseCase } from '../../../domain/use-cases/notification/list-notification.use-case';
import { NotificationBufferUseCase } from '../../../domain/use-cases/notification/notification-buffer.use-case';
import { AnalysisController } from './analysis/analysis.controller';

@Module({
  controllers: [NotificationController, AnalysisController],
  providers: [ListNotificationUseCase, NotificationBufferUseCase],
})
export class NotificationModule {}
