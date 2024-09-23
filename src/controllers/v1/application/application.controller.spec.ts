import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { ApplicationController } from './application.controller';
import { CreateApplicationUseCase } from '../../../domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from '../../../domain/use-cases/application/update-application.use-case';
import { ListApplicationUseCase } from '../../../domain/use-cases/application/list-application.use-case';
import { FinishApplicationUseCase } from '../../../domain/use-cases/application/finish-application.use-case';
import { ApplicationRepository } from '../../../resources/infra/prisma/repositories/application.repository';
import { FindByDistanceProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/find-by-distance-protected-area.use-case';
import { CreateApplicationRequest } from './models/create-application.model';
import createApplicationFixture from '../../../resources/__tests__/fixtures/application.fixture';

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let createApplication: CreateApplicationUseCase;
  let updateApplication: UpdateApplicationUseCase;
  let listApplication: ListApplicationUseCase;
  let finishApplication: FinishApplicationUseCase;
  let applicationRepository: ApplicationRepository;
  let findByDistanceProtectedArea: FindByDistanceProtectedAreaUseCase;

  const createApplicationMock = mock<CreateApplicationUseCase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        {
          provide: CreateApplicationUseCase,
          useValue: createApplicationMock,
        },
        {
          provide: UpdateApplicationUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListApplicationUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FinishApplicationUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ApplicationRepository,
          useValue: { findOne: jest.fn(), remove: jest.fn() },
        },
        {
          provide: FindByDistanceProtectedAreaUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    createApplication = module.get<CreateApplicationUseCase>(
      CreateApplicationUseCase,
    );
    updateApplication = module.get<UpdateApplicationUseCase>(
      UpdateApplicationUseCase,
    );
    listApplication = module.get<ListApplicationUseCase>(
      ListApplicationUseCase,
    );
    finishApplication = module.get<FinishApplicationUseCase>(
      FinishApplicationUseCase,
    );
    applicationRepository = module.get<ApplicationRepository>(
      ApplicationRepository,
    );
    findByDistanceProtectedArea =
      module.get<FindByDistanceProtectedAreaUseCase>(
        FindByDistanceProtectedAreaUseCase,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(createApplication).toBeDefined();
    expect(updateApplication).toBeDefined();
    expect(listApplication).toBeDefined();
    expect(finishApplication).toBeDefined();
    expect(applicationRepository).toBeDefined();
    expect(findByDistanceProtectedArea).toBeDefined();
  });

  it('should create application', async () => {
    // Arrange
    const req = { user: { organizationId: '1', userId: '1' } };
    const applicationData: CreateApplicationRequest = {
      vehicle: 'brave',
      startDate: '2025-08-16T16:11:01Z',
      endDate: '2025-08-16T17:30:00Z',
      pilot: {
        id: 1,
      },
    };
    const application = createApplicationFixture({
      vehicle: applicationData.vehicle,
      startDate: applicationData.startDate,
      endDate: applicationData.endDate,
      pilotId: applicationData.pilot.id,
    });

    jest.spyOn(createApplication, 'execute').mockResolvedValue(application);

    createApplicationMock.execute.mockResolvedValue(application);

    // Act
    const result = await controller.create(req, applicationData);

    expect(result).toBe(application);
    expect(createApplication.execute).toHaveBeenCalledWith({
      organization: {
        id: req.user.organizationId,
      },
      user: {
        id: req.user.userId,
      },
      ...applicationData,
    });
  });
});
