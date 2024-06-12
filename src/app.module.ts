import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './controllers/health/health.module';

@Module({
  imports: [PrismaModule, TerminusModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
