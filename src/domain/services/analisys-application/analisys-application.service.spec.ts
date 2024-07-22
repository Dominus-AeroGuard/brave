import { Test, TestingModule } from '@nestjs/testing';
import { AnalisysApplicationService } from './analisys-application.service';

describe('AnalisysApplicationService', () => {
  let service: AnalisysApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalisysApplicationService],
    }).compile();

    service = module.get<AnalisysApplicationService>(
      AnalisysApplicationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
