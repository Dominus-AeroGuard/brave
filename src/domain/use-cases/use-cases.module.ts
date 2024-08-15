import { Module } from '@nestjs/common';
import { CreateApplicationUseCase } from './application/create-application.use-case';
import { UpdateApplicationUseCase } from './application/update-application.use-case';
import { ListApplicationUseCase } from './application/list-application.use-case';
import { CreateApplicationDocumentUseCase } from './application-document/create-application-document.use-case';
import { CreateProtectedAreaUseCase } from './protected-area/create-protected-area.use-case';
import { FindByDistanceProtectedAreaUseCase } from './protected-area/find-by-distance-protected-area.use-case';
import { ListNotificationUseCase } from './notification/list-notification.use-case';

@Module({
  providers: [
    CreateApplicationUseCase,
    CreateApplicationDocumentUseCase,
    UpdateApplicationUseCase,
    ListApplicationUseCase,
    CreateProtectedAreaUseCase,
    FindByDistanceProtectedAreaUseCase,
    ListNotificationUseCase,
  ],
})
export class UseCasesModule {}
