import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrganizationAreaUseCase } from '../../../domain/use-cases/organization-area/create-organization-area.use-case';
import { OrganizationAreaRepository } from '../../../resources/infra/prisma/repositories/organization-area.repository';
import { OrganizationAreaController } from './organization-area.controller';

describe('OrganizationAreaController', () => {
  let controller: OrganizationAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationAreaController],
      providers: [
        {
          provide: CreateOrganizationAreaUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: OrganizationAreaRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizationAreaController>(OrganizationAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
