import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationDocumentRepository } from './repositories/application-document.repository';
import { UserOrganizationRepository } from './repositories/user-organization.repository';

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
      provide: 'IUserOrganizationRepository',
      useClass: UserOrganizationRepository,
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
      provide: 'IUserOrganizationRepository',
      useClass: UserOrganizationRepository,
    },
  ],
})
export class PrismaModule {}
