import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { IApplicationNotificationRepository } from '../../../resources/infra/prisma/repositories/application-notification.repository';
import { ListNotificationUseCase } from '../../../domain/use-cases/notification/list-notification.use-case';
import { ApplicationNotificationStatusEnum } from '../../../domain/enums/application-notification-status.enum';
import { ListNotificationRequest } from './models/list-notification.model';
import { NotificationBufferUseCase } from '../../../domain/use-cases/notification/notification-buffer.use-case';
import {
  AlertLevelEnum,
  AlertLevelEnumDescription,
} from '../../../domain/enums/alert-level.enum';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationRepository: IApplicationNotificationRepository;
  let listNotificationUseCase: ListNotificationUseCase;
  const notification = {
    id: '1',
    fiscal: {
      id: Number(1),
      name: 'Fiscal',
      '': undefined,
    },
    application: {
      id: '1',
    },
    alertLevel: {
      level: AlertLevelEnum.GRAVISSIMO,
      description: AlertLevelEnumDescription[AlertLevelEnum.GRAVISSIMO],
    },
    status: {
      id: ApplicationNotificationStatusEnum.Pending,
      description: ApplicationNotificationStatusEnum.Pending.toString(),
    },
    analisys: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: ListNotificationUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'IApplicationNotificationRepository',
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: NotificationBufferUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);

    notificationRepository = module.get<IApplicationNotificationRepository>(
      'IApplicationNotificationRepository',
    );
    listNotificationUseCase = module.get<ListNotificationUseCase>(
      ListNotificationUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll', async () => {
    const useCaseResponse = {
      meta: {
        page: 1,
        size: 10,
      },
      data: [notification],
    };

    const useCaseSpy = {
      execute: jest
        .spyOn(listNotificationUseCase, 'execute')
        .mockResolvedValue(useCaseResponse),
    };

    const query = {
      applicationId: [BigInt(123)],
      statusId: [ApplicationNotificationStatusEnum.Pending],
    } as ListNotificationRequest;

    // Act
    const response = await controller.findAll(query);

    // Assert
    expect(response).toBe(useCaseResponse);
    expect(useCaseSpy.execute).toHaveBeenCalledWith({ query });
    expect(useCaseSpy.execute).toHaveBeenCalled();
  });

  it('find', async () => {
    const repositorySpy = {
      findOne: jest
        .spyOn(notificationRepository, 'findOne')
        .mockResolvedValue(notification),
    };

    // Act
    const response = await controller.findOne('123');

    // Assert
    expect(response).toBe(notification);
    expect(repositorySpy.findOne).toHaveBeenCalledWith(BigInt(123));
    expect(repositorySpy.findOne).toHaveBeenCalled();
  });

  it('update', async () => {
    const updateRequest = {
      status: {
        id: ApplicationNotificationStatusEnum.Finished,
      },
    };

    const repositorySpy = {
      update: jest
        .spyOn(notificationRepository, 'update')
        .mockResolvedValue(notification),
    };

    // Act
    const response = await controller.update(
      '123',
      { user: 123 },
      updateRequest,
    );

    // Assert
    expect(response).toBe(notification);
    expect(repositorySpy.update).toHaveBeenCalledWith(BigInt(123), {
      userId: 123,
      statusId: ApplicationNotificationStatusEnum.Finished,
    });
    expect(repositorySpy.update).toHaveBeenCalled();
  });
});
