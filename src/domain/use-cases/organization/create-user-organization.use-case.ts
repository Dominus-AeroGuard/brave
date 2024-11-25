import { Inject, Injectable } from '@nestjs/common';
import { UserOrganization } from '../../../domain/entities';
import { IUserOrganizationRepository } from '../../../resources/infra/prisma/repositories/user-organization.repository';

export interface CreatUserOrganizationRequest {
  organization: {
    id: number;
  };
  user: {
    id: number;
  };
  user_id: number;
}

@Injectable()
export class CreateUserOrganizationUseCase {
  constructor(
    @Inject('IUserOrganizationRepository')
    private userOrganizationRepository: IUserOrganizationRepository,
  ) {}

  async execute(data: CreatUserOrganizationRequest): Promise<UserOrganization> {
    const userOrganization: UserOrganization =
      await this.userOrganizationRepository.findOne(
        data.organization.id,
        data.user_id,
      );

    if (userOrganization) {
      return userOrganization;
    }

    return this.userOrganizationRepository.create(data);
  }
}
