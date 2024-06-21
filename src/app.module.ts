import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './controllers/health/health.module';
import { AwsModule } from './infra/aws/aws.module';

@Module({
  imports: [PrismaModule, TerminusModule, HealthModule, AwsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
