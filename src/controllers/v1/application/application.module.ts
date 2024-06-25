import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { CreateApplicationUseCase } from 'src/domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from 'src/domain/use-cases/application/update-application.use-case';
import { ListApplicationUseCase } from 'src/domain/use-cases/application/list-application.use-case';
import { ApplicationRepository } from 'src/infra/prisma/repositories/application.repository';

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
