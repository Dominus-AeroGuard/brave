import { Inject, Injectable } from '@nestjs/common';
import { PaginableEntity } from '../../../controllers/dtos/paginable.dto';
import { Permission } from '../../entities';
import { IPermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';

@Injectable()
export class ListPermissionUseCase {
  constructor(
    @Inject('IPermissionRepository')
    private permissionRepository: IPermissionRepository,
  ) {}

  async execute(
    params: Partial<{
      permissionId: number;
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<PaginableEntity<Permission>> {
    const result = await this.permissionRepository.findAll(params);

    return new PaginableEntity<Permission>(result, {
      page: params.page,
      size: params.pageSize,
    });
  }
}
