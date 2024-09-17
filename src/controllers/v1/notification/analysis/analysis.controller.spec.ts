import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisController } from './analysis.controller';
import { IApplicationAnalisysRepository } from '../../../../infra/prisma/repositories/application-analisys.repository';
import { NotificationBufferUseCase } from '../../../../domain/use-cases/notification/notification-buffer.use-case';

describe('AnalysisController', () => {
  let controller: AnalysisController;
  let notificationBufferUseCase: NotificationBufferUseCase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let analysisRepository: IApplicationAnalisysRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        {
          provide: NotificationBufferUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'IApplicationAnalisysRepository',
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);

    analysisRepository = module.get<IApplicationAnalisysRepository>(
      'IApplicationAnalisysRepository',
    );
    notificationBufferUseCase = module.get<NotificationBufferUseCase>(
      NotificationBufferUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAnalisyBuffer', async () => {
    const useCaseResponse = {
      id: '1',
      analysisId: 10,
      applicationAreaGeoJSON: '',
      protectedAreaGeoJSON: '',
      protectedAreaBufferGeoJSON: '',
    };

    const useCaseSpy = {
      execute: jest
        .spyOn(notificationBufferUseCase, 'execute')
        .mockResolvedValue(useCaseResponse),
    };

    // Act
    const response = await controller.findAnalisyBuffer('1', '10');

    // Assert
    expect(response).toBe(useCaseResponse);
    expect(useCaseSpy.execute).toHaveBeenCalledWith(1n, 10);
    expect(useCaseSpy.execute).toHaveBeenCalled();
  });
});
