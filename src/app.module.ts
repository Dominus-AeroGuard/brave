import { Module } from '@nestjs/common';
import { PrismaModule } from './resources/infra/prisma/prisma.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './controllers/health/health.module';
import { AwsModule } from './resources/infra/aws/aws.module';
import { AuthModule } from './resources/auth/auth.module';
import { JwtStrategy } from './resources/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationModule } from './controllers/v1/application/application.module';
import { OrganizationModule } from './controllers/v1/organization/organization.module';
import { PermissionModule } from './controllers/v1/permission/permission.module';
import { APP_PIPE } from '@nestjs/core';
import { SchemaValidationPipe } from './resources/pipes/schema-validation.pipe';
import { ApplicationDocumentsModule } from './controllers/v1/application-documents/application-documents.module';
import { DomainModule } from './domain/domain.module';
import { ProtectedAreaModule } from './controllers/v1/protected-area/protected-area.module';
import { NotificationModule } from './controllers/v1/notification/notification.module';
import { RestModule } from './resources/infra/http/rest.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TerminusModule,
    HealthModule,
    AuthModule,
    PassportModule,
    AwsModule,
    RestModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    ApplicationModule,
    ApplicationDocumentsModule,
    OrganizationModule,
    PermissionModule,
    ProtectedAreaModule,
    DomainModule,
    NotificationModule,
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
