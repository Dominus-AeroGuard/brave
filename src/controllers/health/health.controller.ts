import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { S3HealthIndicator } from './s3.health';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private s3: S3HealthIndicator,
    private prismaClient: PrismaClient,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', this.prismaClient),
    ]);
  }

  @Get('aws')
  @HealthCheck()
  checkAws() {
    return this.health.check([
      () => this.db.pingCheck('database', this.prismaClient),
      () => this.s3.isBucketsUp(),
    ]);
  }
}
