import { Module } from '@nestjs/common';
import { ApplicationDocumentsController } from './application-documents.controller';
import { CreateApplicationDocumentUseCase } from '../../../domain/use-cases/application-document/create-application-document.use-case';
import { ApplicationDocumentRepository } from '../../../resources/infra/prisma/repositories/application-document.repository';
import { UpdateDocumentDataUseCase } from '../../../domain/use-cases/application-document/update-document-data.use-case';

@Module({
  controllers: [ApplicationDocumentsController],
  providers: [
    CreateApplicationDocumentUseCase,
    ApplicationDocumentRepository,
    UpdateDocumentDataUseCase,
  ],
})
export class ApplicationDocumentsModule {}
