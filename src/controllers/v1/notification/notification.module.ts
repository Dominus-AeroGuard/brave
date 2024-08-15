import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ListNotificationUseCase } from '../../../domain/use-cases/notification/list-notification.use-case';

@Module({
  controllers: [NotificationController],
  providers: [ListNotificationUseCase],
})
export class NotificationModule {}
