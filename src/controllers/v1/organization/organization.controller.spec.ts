import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { CreateUserOrganizationUseCase } from '../../../domain/use-cases/organization/create-user-organization.use-case';
import { ListOrganizationUserUseCase } from '../../../domain/use-cases/organization/list-organization-user.use-case';
import { UserOrganizationRepository } from '../../../infra/prisma/repositories/user-organization.repository';

describe('OrganizationController', () => {
  let controller: OrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        {
          provide: CreateUserOrganizationUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListOrganizationUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UserOrganizationRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
