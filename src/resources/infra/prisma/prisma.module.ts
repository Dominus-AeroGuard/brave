import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationDocumentRepository } from './repositories/application-document.repository';
import { ApplicationAreaRepository } from './repositories/application-area.repository';
import { UserOrganizationRepository } from './repositories/user-organization.repository';
import { ProtectedAreaRepository } from './repositories/protected-area.repository';
import { ApplicationNotificationRepository } from './repositories/application-notification.repository';
import { ApplicationAnalisysRepository } from './repositories/application-analisys.repository';
import { ProtectedAreaTypeRepository } from './repositories/protected-area-type.repository';
import { ApplicationDocumentDataRepository } from './repositories/application-document-data.repository';
import { ApplicationPathRepository } from './repositories/application-path.repository';

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
    {
      provide: 'IApplicationPathRepository',
      useClass: ApplicationPathRepository,
    },
    {
      provide: 'IUserOrganizationRepository',
      useClass: UserOrganizationRepository,
    },
    {
      provide: 'IProtectedAreaRepository',
      useClass: ProtectedAreaRepository,
    },
    {
      provide: 'IProtectedAreaTypeRepository',
      useClass: ProtectedAreaTypeRepository,
    },
    {
      provide: 'IApplicationNotificationRepository',
      useClass: ApplicationNotificationRepository,
    },
    {
      provide: 'IApplicationAnalisysRepository',
      useClass: ApplicationAnalisysRepository,
    },
    {
      provide: 'IApplicationDocumentDataRepository',
      useClass: ApplicationDocumentDataRepository,
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
    {
      provide: 'IApplicationPathRepository',
      useClass: ApplicationPathRepository,
    },
    {
      provide: 'IUserOrganizationRepository',
      useClass: UserOrganizationRepository,
    },
    {
      provide: 'IProtectedAreaRepository',
      useClass: ProtectedAreaRepository,
    },
    {
      provide: 'IProtectedAreaTypeRepository',
      useClass: ProtectedAreaTypeRepository,
    },
    {
      provide: 'IApplicationNotificationRepository',
      useClass: ApplicationNotificationRepository,
    },
    {
      provide: 'IApplicationAnalisysRepository',
      useClass: ApplicationAnalisysRepository,
    },
    {
      provide: 'IApplicationDocumentDataRepository',
      useClass: ApplicationDocumentDataRepository,
    },
  ],
})
export class PrismaModule {}
