import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationDocumentRepository } from './repositories/application-document.repository';
import { ApplicationAreaRepository } from './repositories/application-area.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'IApplicationRepository',
      useClass: ApplicationRepository,
    },
    {
      provide: 'IApplicationDocumentRepository',
      useClass: ApplicationDocumentRepository,
    },
    {
      provide: 'IApplicationAreaRepository',
      useClass: ApplicationAreaRepository,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: 'IApplicationRepository',
      useClass: ApplicationRepository,
    },
    {
      provide: 'IApplicationDocumentRepository',
      useClass: ApplicationDocumentRepository,
    },
    {
      provide: 'IApplicationAreaRepository',
      useClass: ApplicationAreaRepository,
    },
  ],
})
export class PrismaModule {}
