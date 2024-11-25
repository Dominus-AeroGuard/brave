import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
