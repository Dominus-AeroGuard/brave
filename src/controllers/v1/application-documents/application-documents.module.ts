import { Module } from '@nestjs/common';
import { ApplicationDocumentsController } from './application-documents.controller';
import { CreateApplicationDocumentUseCase } from '../../../domain/use-cases/application-document/create-application-document.use-case';
import { ApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';

@Module({
  controllers: [ApplicationDocumentsController],
  providers: [CreateApplicationDocumentUseCase, ApplicationDocumentRepository],
})
export class ApplicationDocumentsModule {}
