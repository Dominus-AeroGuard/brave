import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../entities';
import { IPermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';

export interface CreatPermissionRequest {
  permissionId: number;
  resource: string;
  action: string;
  description: string;
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject('IPermissionRepository')
    private permissionRepository: IPermissionRepository,
  ) {}

  execute(data: CreatPermissionRequest): Promise<Permission> {
    return this.permissionRepository.create(data);
  }
}
