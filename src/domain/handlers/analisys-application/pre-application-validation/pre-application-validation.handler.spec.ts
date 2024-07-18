import { Test, TestingModule } from '@nestjs/testing';
import { PreApplicationValidationHandler } from './pre-application-validation.handler';

describe('PreApplicationValidationHandler', () => {
  let service: PreApplicationValidationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreApplicationValidationHandler],
    }).compile();

    service = module.get<PreApplicationValidationHandler>(
      PreApplicationValidationHandler,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
