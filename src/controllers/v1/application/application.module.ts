import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { CreateApplicationUseCase } from '../../../domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from '../../../domain/use-cases/application/update-application.use-case';
import { ListApplicationUseCase } from '../../../domain/use-cases/application/list-application.use-case';
import { ApplicationRepository } from '../../../infra/prisma/repositories/application.repository';

@Module({
  controllers: [ApplicationController],
  providers: [
    CreateApplicationUseCase,
    UpdateApplicationUseCase,
    ListApplicationUseCase,
    ApplicationRepository,
  ],
})
export class ApplicationModule {}