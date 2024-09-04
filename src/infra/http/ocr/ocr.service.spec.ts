import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { OcrService } from './ocr.service';
import { ConfigService } from '@nestjs/config';

describe('OcrService', () => {
  let service: OcrService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcrService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockResolvedValue({ data: {} }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OcrService>(OcrService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
    expect(configService).toBeDefined();
  });
});
