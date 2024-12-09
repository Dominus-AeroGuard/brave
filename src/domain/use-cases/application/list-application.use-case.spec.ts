import { Test } from '@nestjs/testing';
import {
  ListApplicationRequest,
  ListApplicationUseCase,
} from './list-application.use-case';
import { IApplicationRepository } from '../../../resources/infra/prisma/repositories/application.repository';

describe('ListApplicationUseCase', () => {
  let useCase: ListApplicationUseCase;
  let repository: IApplicationRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListApplicationUseCase,
        {
          provide: 'IApplicationRepository',
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<ListApplicationUseCase>(ListApplicationUseCase);
    repository = moduleRef.get<IApplicationRepository>(
      'IApplicationRepository',
    );
  });

  describe('execute', () => {
    it('should list applications', async () => {
      // Arrange
      const applications = [
        {
          id: '1',
          vehicle: 'brave',
          startDate: new Date(),
          endDate: new Date(),
          user: {
            id: 1,
            name: 'Jonh Doe',
          },
          organization: {
            id: 1,
            name: 'Test Organization',
          },
          pilot: {
            id: 1,
            name: 'Jonh Doe',
            document: '92564656048',
            license: '123456',
          },
          status: {
            id: 1,
            description: 'Planning',
          },
          createdBy: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const request: ListApplicationRequest = {
        organizationId: 1,
        page: 1,
        pageSize: 10,
      };

      const repositorySpy = {
        findAll: jest
          .spyOn(repository, 'findAll')
          .mockResolvedValue(applications),
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(repositorySpy.findAll).toHaveBeenCalledWith(request);

      expect(result).toEqual({
        meta: {
          page: 1,
          size: 10,
          count: 1,
          countRecords: 1,
        },
        data: applications,
      });
    });
  });
});
