import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsValidationHandler } from './documents-validation.handler';

describe('DocumentsValidationHandler', () => {
  let service: DocumentsValidationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsValidationHandler],
    }).compile();

    service = module.get<DocumentsValidationHandler>(
      DocumentsValidationHandler,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
