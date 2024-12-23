import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserRoleModule } from './user-role/user-role.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    RoleModule,
    PermissionModule,
    UserRoleModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
