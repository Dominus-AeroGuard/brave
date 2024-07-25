import { Test } from '@nestjs/testing';
import {
  CreatUserOrganizationRequest,
  CreateUserOrganizationUseCase,
} from './create-user-organization.use-case';
import { IUserOrganizationRepository } from '../../../infra/prisma/repositories/user-organization.repository';

describe('CreateUserOrganizationUseCase', () => {
  let useCase: CreateUserOrganizationUseCase;
  let repository: IUserOrganizationRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserOrganizationUseCase,
        {
          provide: 'IUserOrganizationRepository',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<CreateUserOrganizationUseCase>(
      CreateUserOrganizationUseCase,
    );
    repository = moduleRef.get<IUserOrganizationRepository>(
      'IUserOrganizationRepository',
    );
  });

  describe('execute', () => {
    it('should create an user organization and return it', async () => {
      // Arrange
      const request: CreatUserOrganizationRequest = {
        organization: {
          id: 123,
        },
        user: {
          id: 456,
        },
        user_id: 456,
      };

      const repositorySpy = {
        create: jest.spyOn(repository, 'create').mockResolvedValue({
          user_id: 456,
          organization_id: 123,
          user_status: 'INVITED',
          created_at: '2021-09-01T00:00:00.000Z',
        }),
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(repositorySpy.create).toHaveBeenCalledWith({
        organization: { id: 123 },
        user: { id: 456 },
        user_id: 456,
      });

      expect(result).toEqual({
        user_id: 456,
        organization_id: 123,
        user_status: 'INVITED',
        created_at: '2021-09-01T00:00:00.000Z',
      });
    });
  });
});
