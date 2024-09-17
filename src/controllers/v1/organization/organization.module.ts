import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { CreateUserOrganizationUseCase } from '../../../domain/use-cases/organization/create-user-organization.use-case';
import { ListOrganizationUserUseCase } from '../../../domain/use-cases/organization/list-organization-user.use-case';
import { UserOrganizationRepository } from '../../../resources/infra/prisma/repositories/user-organization.repository';

@Module({
  controllers: [OrganizationController],
  providers: [
    CreateUserOrganizationUseCase,
    ListOrganizationUserUseCase,
    UserOrganizationRepository,
  ],
})
export class OrganizationModule {}
