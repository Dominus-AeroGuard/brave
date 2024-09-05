import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ListNotificationUseCase } from '../../../domain/use-cases/notification/list-notification.use-case';
import { NotificationBufferUseCase } from '../../../domain/use-cases/notification/notification-buffer.use-case';

@Module({
  controllers: [NotificationController],
  providers: [ListNotificationUseCase, NotificationBufferUseCase],
})
export class NotificationModule {}
