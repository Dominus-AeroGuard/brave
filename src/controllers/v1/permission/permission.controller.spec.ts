import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { CreatePermissionUseCase } from '../../../domain/use-cases/permission/create-permission.use-case';
import { ListPermissionUseCase } from '../../../domain/use-cases/permission/list-permission.use-case';
import { PermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';

describe('PermissionController', () => {
  let controller: PermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: CreatePermissionUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListPermissionUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: PermissionRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
