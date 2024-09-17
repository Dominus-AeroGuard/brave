import { Inject, Injectable } from '@nestjs/common';
import { PaginableEntity } from '../../../controllers/dtos/paginable.dto';
import { UserOrganization } from '../../../domain/entities';
import { IUserOrganizationRepository } from '../../../resources/infra/prisma/repositories/user-organization.repository';

@Injectable()
export class ListOrganizationUserUseCase {
  constructor(
    @Inject('IUserOrganizationRepository')
    private userOrganizationRepository: IUserOrganizationRepository,
  ) {}

  async execute(
    params: Partial<{
      organizationId: number;
      page?: number;
      pageSize?: number;
    }>,
  ): Promise<PaginableEntity<UserOrganization>> {
    const result = await this.userOrganizationRepository.findAll(params);

    return new PaginableEntity<UserOrganization>(result, {
      page: params.page,
      size: params.pageSize,
    });
  }
}
