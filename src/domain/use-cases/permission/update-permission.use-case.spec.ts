import { Test } from '@nestjs/testing';
import { UpdatePermissionUseCase } from './update-permission.use-case';
import { IPermissionRepository } from '../../../resources/infra/prisma/repositories/permission.repository';
import { UpdatePermissionRequest } from 'src/controllers/v1/permission/models/update-permission.model';

describe('UpdatePermissionUseCase', () => {
  let useCase: UpdatePermissionUseCase;
  let repository: IPermissionRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdatePermissionUseCase,
        {
          provide: 'IPermissionRepository',
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<UpdatePermissionUseCase>(UpdatePermissionUseCase);
    repository = moduleRef.get<IPermissionRepository>('IPermissionRepository');
  });

  describe('execute', () => {
    it('should update a permission and return it', async () => {
      // Arrange
      const request: UpdatePermissionRequest = {
        permissionId: 1,
        resource: 'application',
        action: 'write',
        description: 'Criar aplicação',
        user_id: 1,
      };

      const repositorySpy = {
        update: jest.spyOn(repository, 'update').mockResolvedValue({
          id: 1,
          resource: 'application',
          action: 'write',
          description: 'Criar aplicação',
          user_id: 1,
        }),
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(repositorySpy.update).toHaveBeenCalledWith({
        id: 1,
        resource: 'application',
        action: 'write',
        description: 'Criar aplicação',
        user_id: 1,
      });

      expect(result).toEqual({
        id: 1,
        resource: 'application',
        action: 'write',
        description: 'Criar aplicação',
        user_id: 1,
      });
    });
  });
});
