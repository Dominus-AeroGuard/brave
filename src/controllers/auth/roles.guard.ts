import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    if (!requiredPermissions.length && !requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Acesso negado');
    }

    const hasRole = user.roles.some((role: string) =>
      requiredRoles.includes(role),
    );

    const hasPermission = user.permissions.some((perm: string) =>
      requiredPermissions.includes(perm),
    );

    if (!hasRole && !hasPermission) {
      throw new ForbiddenException({
        message: 'Acesso negado',
        required: {
          roles: requiredRoles,
          permissions: requiredPermissions,
        },
      });
    }

    return true;
  }
}
