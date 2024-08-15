import { Module } from '@nestjs/common';
import { PrismaHealthIndicator, TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaClient } from '@prisma/client';
import { RequestContextService } from '../../services/request-context.service';
import { S3HealthIndicator } from './s3.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    PrismaHealthIndicator,
    PrismaClient,
    RequestContextService,
    S3HealthIndicator,
  ],
})
export class HealthModule {}
