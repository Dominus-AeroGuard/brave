import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { CreateApplicationUseCase } from '../../../domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from '../../../domain/use-cases/application/update-application.use-case';
import { ListApplicationUseCase } from '../../../domain/use-cases/application/list-application.use-case';
import { FinishApplicationUseCase } from '../../../domain/use-cases/application/finish-application.use-case';
import { ApplicationRepository } from '../../../infra/prisma/repositories/application.repository';
import { FindByDistanceProtectedAreaUseCase } from 'src/domain/use-cases/protected-area/find-by-distance-protected-area.use-case';

@Module({
  controllers: [ApplicationController],
  providers: [
    CreateApplicationUseCase,
    UpdateApplicationUseCase,
    ListApplicationUseCase,
    FinishApplicationUseCase,
    ApplicationRepository,
    FindByDistanceProtectedAreaUseCase
  ],
})
export class ApplicationModule {}
