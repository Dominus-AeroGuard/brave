import { Test } from '@nestjs/testing';
import {
  CreatPermissionRequest,
  CreatePermissionUseCase,
} from './create-permission.use-case';
import { IPermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';

describe('CreatePermissionUseCase', () => {
  let useCase: CreatePermissionUseCase;
  let repository: IPermissionRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreatePermissionUseCase,
        {
          provide: 'IPermissionRepository',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<CreatePermissionUseCase>(CreatePermissionUseCase);
    repository = moduleRef.get<IPermissionRepository>('IPermissionRepository');
  });

  describe('execute', () => {
    it('should create a permission and return it', async () => {
      // Arrange
      const request: CreatPermissionRequest = {
        permissionId: 1,
        resource: 'application',
        action: 'write',
        description: 'Criar aplicação',
      };

      const repositorySpy = {
        create: jest.spyOn(repository, 'create').mockResolvedValue({
          id: 1,
          resource: 'application',
          action: 'write',
          description: 'Criar aplicação',
        }),
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(repositorySpy.create).toHaveBeenCalledWith({
        resource: 'application',
        action: 'write',
        description: 'Criar aplicação',
      });

      expect(result).toEqual({
        resource: 'application',
        action: 'write',
        description: 'Criar aplicação',
      });
    });
  });
});
