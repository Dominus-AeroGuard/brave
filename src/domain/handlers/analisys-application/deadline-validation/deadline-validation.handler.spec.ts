import { Test, TestingModule } from '@nestjs/testing';
import { DeadlineValidationHandler } from './deadline-validation.handler';

describe('DeadlineValidationHandler', () => {
  let service: DeadlineValidationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeadlineValidationHandler],
    }).compile();

    service = module.get<DeadlineValidationHandler>(DeadlineValidationHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
