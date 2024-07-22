import { Global, Module } from '@nestjs/common';
import { UseCasesModule } from './use-cases/use-cases.module';
import { ApplicationDocumentService } from './services/application-document/application-document.service';
import { AnalisysApplicationService } from './services/analisys-application/analisys-application.service';
import { HandlersModule } from './handlers/handlers.module';

@Global()
@Module({
  exports: [ApplicationDocumentService, AnalisysApplicationService],
  providers: [
    UseCasesModule,
    ApplicationDocumentService,
    AnalisysApplicationService,
  ],
  imports: [HandlersModule],
})
export class DomainModule {}
