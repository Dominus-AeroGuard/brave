import { Test, TestingModule } from '@nestjs/testing';
import { SendNotificationHandler } from './send-notification.handler';

describe('SendNotificationHandler', () => {
  let service: SendNotificationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendNotificationHandler],
    }).compile();

    service = module.get<SendNotificationHandler>(SendNotificationHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
