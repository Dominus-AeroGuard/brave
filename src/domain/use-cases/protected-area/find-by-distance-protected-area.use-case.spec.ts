import { Test } from '@nestjs/testing';
import { IProtectedAreaRepository } from '../../../infra/prisma/repositories/protected-area.repository';
import { FindByDistanceProtectedAreaUseCase } from './find-by-distance-protected-area.use-case';

describe('FindByDistanceProtectedAreaUseCase', () => {
  let useCase: FindByDistanceProtectedAreaUseCase;
  let repository: IProtectedAreaRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindByDistanceProtectedAreaUseCase,
        {
          provide: 'IProtectedAreaRepository',
          useValue: {
            findByDistance: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<FindByDistanceProtectedAreaUseCase>(
      FindByDistanceProtectedAreaUseCase,
    );
    repository = moduleRef.get<IProtectedAreaRepository>(
      'IProtectedAreaRepository',
    );
  });

  describe('execute', () => {
    it('should find protected areas by distance from application', async () => {
      const areas = [];

      const repositorySpy = {
        findByDistance: jest
          .spyOn(repository, 'findByDistance')
          .mockResolvedValue(areas),
      };

      // Act
      const result = await useCase.execute({
        applicationId: 1,
        distance: 500,
        typeId: 2,
      });

      // Assert
      expect(repositorySpy.findByDistance).toHaveBeenCalledWith(1, 500, 2);

      expect(result).toEqual([]);
    });
  });
});
