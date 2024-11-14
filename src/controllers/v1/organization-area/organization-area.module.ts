import { Module } from '@nestjs/common';
import { OrganizationAreaController } from './organization-area.controller';
import { CreateOrganizationAreaUseCase } from '../../../domain/use-cases/organization-area/create-organization-area.use-case';
import { OrganizationAreaRepository } from '../../../resources/infra/prisma/repositories/organization-area.repository';

@Module({
  controllers: [OrganizationAreaController],
  providers: [CreateOrganizationAreaUseCase, OrganizationAreaRepository],
})
export class OrganizationAreaModule {}
