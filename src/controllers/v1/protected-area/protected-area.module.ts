import { Module } from '@nestjs/common';
import { ProtectedAreaController } from './protected-area.controller';
import { CreateProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/create-protected-area.use-case';
import { ProtectedAreaRepository } from '../../../infra/prisma/repositories/protected-area.repository';
import { FindByDistanceProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/find-by-distance-protected-area.use-case';

@Module({
  controllers: [ProtectedAreaController],
  providers: [
    CreateProtectedAreaUseCase,
    FindByDistanceProtectedAreaUseCase,
    ProtectedAreaRepository,
  ],
})
export class ProtectedAreaModule {}
