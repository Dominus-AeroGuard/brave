import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionHandler } from './prescription.handler';

describe('PrescriptionHandler', () => {
  let service: PrescriptionHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionHandler],
    }).compile();

    service = module.get<PrescriptionHandler>(PrescriptionHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
