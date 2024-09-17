import { Test, TestingModule } from '@nestjs/testing';
import { SendNotificationHandler } from './send-notification.handler';
import { IApplicationNotificationRepository } from '../../../../resources/infra/prisma/repositories/application-notification.repository';
import { IApplicationAnalisysRepository } from '../../../../resources/infra/prisma/repositories/application-analisys.repository';
import { ApplicationAnalisysStatusEnum } from '../../../../domain/enums/application-analisys-status.enum';
import { ApplicationAnalisys } from '../../../../domain/entities/application-analisys.entity';
import { ApplicationNotificationStatusEnum } from '../../../../domain/enums/application-notification-status.enum';
import {
  AlertLevelEnum,
  AlertLevelEnumDescription,
} from '../../../../domain/enums/alert-level.enum';

describe('SendNotificationHandler', () => {
  let handler: SendNotificationHandler;
  let applicationNotificationRepository: IApplicationNotificationRepository;
  let applicationAnalisysRepository: IApplicationAnalisysRepository;

  const buildAnalisysMock = (status: ApplicationAnalisysStatusEnum) => [
    {
      id: 1,
      elapsedTime: 1200,
      type: { name: 'WEATHER' },
      details: '',
      status,
      createdAt: new Date(),
    },
  ];

  const buildNotificationMock = (analisys: ApplicationAnalisys[]) => ({
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
    analisys,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendNotificationHandler,
        {
          provide: 'IApplicationNotificationRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'IApplicationAnalisysRepository',
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<SendNotificationHandler>(SendNotificationHandler);
    applicationNotificationRepository =
      module.get<IApplicationNotificationRepository>(
        'IApplicationNotificationRepository',
      );
    applicationAnalisysRepository = module.get<IApplicationAnalisysRepository>(
      'IApplicationAnalisysRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create notification when some analisys was failed', async () => {
    const analisys = buildAnalisysMock(ApplicationAnalisysStatusEnum.FAILED);
    const notification = buildNotificationMock(analisys);

    const applicationNotificationRepositorySpy = {
      create: jest
        .spyOn(applicationNotificationRepository, 'create')
        .mockResolvedValue(notification),
    };

    const applicationAnalisysRepositorySpy = {
      findAll: jest
        .spyOn(applicationAnalisysRepository, 'findAll')
        .mockResolvedValue(analisys),
    };

    const context = {
      applicationId: BigInt(1),
      userId: 1,
    };

    await handler.handle(context);

    expect(applicationAnalisysRepositorySpy.findAll).toHaveBeenCalled();
    expect(applicationNotificationRepositorySpy.create).toHaveBeenCalled();
  });

  it('should create notification when some analisys was failed', async () => {
    const analisys = [];
    const notification = buildNotificationMock([]);

    const applicationNotificationRepositorySpy = {
      create: jest
        .spyOn(applicationNotificationRepository, 'create')
        .mockResolvedValue(notification),
    };

    const applicationAnalisysRepositorySpy = {
      findAll: jest
        .spyOn(applicationAnalisysRepository, 'findAll')
        .mockResolvedValue(analisys),
    };

    const context = {
      applicationId: BigInt(1),
      userId: 1,
    };

    await handler.handle(context);

    expect(applicationAnalisysRepositorySpy.findAll).toHaveBeenCalled();
    expect(applicationNotificationRepositorySpy.create).not.toHaveBeenCalled();
  });
});
