import { Inject, Injectable } from '@nestjs/common';
import { UserOrganization } from '../../../domain/entities';
import { IUserOrganizationRepository } from '../../../infra/prisma/repositories/user-organization.repository';

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

  execute(data: CreatUserOrganizationRequest): Promise<UserOrganization> {
    return this.userOrganizationRepository.create(data);
  }
}
