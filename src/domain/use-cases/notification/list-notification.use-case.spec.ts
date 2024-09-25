import { Test } from '@nestjs/testing';
import {
  ListNotificationRequest,
  ListNotificationUseCase,
} from './list-notification.use-case';
import { IApplicationNotificationRepository } from '../../../resources/infra/prisma/repositories/application-notification.repository';
import { ApplicationNotificationStatusEnum } from '../../enums/application-notification-status.enum';
import {
  AlertLevelEnum,
  AlertLevelEnumDescription,
} from '../../enums/alert-level.enum';

describe('ListNotificationUseCase', () => {
  let useCase: ListNotificationUseCase;
  let repository: IApplicationNotificationRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListNotificationUseCase,
        {
          provide: 'IApplicationNotificationRepository',
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<ListNotificationUseCase>(ListNotificationUseCase);
    repository = moduleRef.get<IApplicationNotificationRepository>(
      'IApplicationNotificationRepository',
    );
  });

  describe('execute', () => {
    it('should list notifications', async () => {
      // Arrange
      const notifications = [
        {
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
        },
      ];
      const request: ListNotificationRequest = {
        query: {
          page: 1,
          pageSize: 10,
          applicationId: [BigInt(1)],
        },
      };

      const repositorySpy = {
        findAll: jest
          .spyOn(repository, 'findAll')
          .mockResolvedValue(notifications),
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(repositorySpy.findAll).toHaveBeenCalledWith(request.query);

      expect(result).toEqual({
        meta: {
          page: 1,
          size: 10,
        },
        data: notifications,
      });
    });
  });
});
