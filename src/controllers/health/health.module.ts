import { Module } from '@nestjs/common';
import { PrismaHealthIndicator, TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, PrismaClient],
})
export class HealthModule {}
