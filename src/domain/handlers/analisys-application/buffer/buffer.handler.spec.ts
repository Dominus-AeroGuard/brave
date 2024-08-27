import { Test, TestingModule } from '@nestjs/testing';
import { BufferHandler } from './buffer.handler';
import { IProtectedAreaTypeRepository } from '../../../../infra/prisma/repositories/protected-area-type.repository';

describe('BufferHandler', () => {
  let service: BufferHandler;
  let protectedAreaTypeRepository: IProtectedAreaTypeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BufferHandler, 
        {
          provide: 'IApplicationAnalisysRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'IProtectedAreaRepository',
          useValue: {
            findByDistance: jest.fn(),
          },
        },      
        {
          provide: 'IProtectedAreaTypeRepository',
          useValue: {
            findAll: jest.fn(),
          },
        },      
      ],
    }).compile();

    service = module.get<BufferHandler>(BufferHandler);
    protectedAreaTypeRepository = module.get<IProtectedAreaTypeRepository>(
      'IProtectedAreaTypeRepository',
    );
  });

  describe('handle', () => {
    it('should execute buffer analysis', async () => {
      const areaTypes = [
      ];
     
      const repositorySpy = {
        findAll: jest
          .spyOn(protectedAreaTypeRepository, 'findAll')
          .mockResolvedValue(areaTypes),
      };

      const context = {
        applicationId: BigInt(1),
        userId: 1
      }

      // Act
      const result = await service.handle(context);

      expect(result).toEqual(null);
    });
  });

});
