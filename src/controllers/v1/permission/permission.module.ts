import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { CreatePermissionUseCase } from '../../../domain/use-cases/permission/create-permission.use-case';
import { UpdatePermissionUseCase } from '../../../domain/use-cases/permission/update-permission.use-case';
import { ListPermissionUseCase } from '../../../domain/use-cases/permission/list-permission.use-case';
import { PermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    UpdatePermissionUseCase,
    ListPermissionUseCase,
    PermissionRepository,
  ],
})
export class PermissionModule {}
