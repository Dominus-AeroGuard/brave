import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './controllers/health/health.module';
import { AwsModule } from './infra/aws/aws.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationModule } from './controllers/v1/application/application.module';
import { APP_PIPE } from '@nestjs/core';
import { SchemaValidationPipe } from './pipes/schema-validation.pipe';
import { ApplicationDocumentsModule } from './controllers/v1/application-documents/application-documents.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    PrismaModule,
    TerminusModule,
    HealthModule,
    AuthModule,
    PassportModule,
    AwsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    ApplicationModule,
    ApplicationDocumentsModule,
    DomainModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    {
      provide: APP_PIPE,
      useClass: SchemaValidationPipe,
    },
  ],
})
export class AppModule {}
