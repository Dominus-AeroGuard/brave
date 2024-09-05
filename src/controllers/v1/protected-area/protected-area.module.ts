import { Module } from '@nestjs/common';
import { ProtectedAreaController } from './protected-area.controller';
import { CreateProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/create-protected-area.use-case';
import { ProtectedAreaRepository } from '../../../infra/prisma/repositories/protected-area.repository';

@Module({
  controllers: [ProtectedAreaController],
  providers: [CreateProtectedAreaUseCase, ProtectedAreaRepository],
})
export class ProtectedAreaModule {}
