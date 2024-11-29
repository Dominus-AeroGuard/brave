import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../entities';
import { IPermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';

export interface UpdatePermissionRequest {
  permissionId: number;
  resource: string;
  action: string;
  description: string;
  user_id: number;
}

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject('IPermissionRepository')
    private permissionRepository: IPermissionRepository,
  ) {}

  execute(data: UpdatePermissionRequest): Promise<Permission> {
    return this.permissionRepository.update(data);
  }
}
