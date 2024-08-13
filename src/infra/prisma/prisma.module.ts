import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationDocumentRepository } from './repositories/application-document.repository';
import { ApplicationAreaRepository } from './repositories/application-area.repository';
import { UserOrganizationRepository } from './repositories/user-organization.repository';
import { ProtectedAreaRepository } from './repositories/protected-area.repository';

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
      provide: 'IUserOrganizationRepository',
      useClass: UserOrganizationRepository,
    },
    {
      provide: 'IProtectedAreaRepository',
      useClass: ProtectedAreaRepository,
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
      provide: 'IUserOrganizationRepository',
      useClass: UserOrganizationRepository,
    },
    {
      provide: 'IProtectedAreaRepository',
      useClass: ProtectedAreaRepository,
    },
  ],
})
export class PrismaModule {}
