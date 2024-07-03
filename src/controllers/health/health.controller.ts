import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';
import { AwsService } from 'src/infra/aws/aws.service';
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
    private awsService: AwsService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', this.prismaClient),
      () => this.s3.isBucketsUp(),
    ]);
  }

  @Get('aws')
  checkAws() {
    return this.awsService.listBuckets();
  }
}
