import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { CreateApplicationUseCase } from '../../../domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from '../../../domain/use-cases/application/update-application.use-case';
import { ListApplicationUseCase } from '../../../domain/use-cases/application/list-application.use-case';
import { ApplicationRepository } from '../../../resources/infra/prisma/repositories/application.repository';
import { FinishApplicationUseCase } from '../../../domain/use-cases/application/finish-application.use-case';
import { FindByDistanceProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/find-by-distance-protected-area.use-case';

describe('ApplicationController', () => {
  let controller: ApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        {
          provide: CreateApplicationUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateApplicationUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListApplicationUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ApplicationRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: FinishApplicationUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindByDistanceProtectedAreaUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
