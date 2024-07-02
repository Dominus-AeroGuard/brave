import { Global, Module } from '@nestjs/common';
import { UseCasesModule } from './use-cases/use-cases.module';
import { ApplicationDocumentService } from './services/application-document/application-document.service';

@Global()
@Module({
  exports: [ApplicationDocumentService],
  providers: [UseCasesModule, ApplicationDocumentService],
})
export class DomainModule {}
