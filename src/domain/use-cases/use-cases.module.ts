import { Module } from '@nestjs/common';
import { CreateApplicationUseCase } from './application/create-application.use-case';
import { UpdateApplicationUseCase } from './application/update-application.use-case';
import { ListApplicationUseCase } from './application/list-application.use-case';
import { CreateApplicationDocumentUseCase } from './application-document/create-application-document.use-case';

@Module({
  providers: [
    CreateApplicationUseCase,
    CreateApplicationDocumentUseCase,
    UpdateApplicationUseCase,
    ListApplicationUseCase,
  ],
})
export class UseCasesModule {}
