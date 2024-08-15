import { Test, TestingModule } from '@nestjs/testing';
import { WeatherHandler } from './weather.handler';

describe('WeatherHandler', () => {
  let service: WeatherHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherHandler,
        {
          provide: 'IApplicationAnalisysRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherHandler>(WeatherHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
