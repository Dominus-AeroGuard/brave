import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationHandler } from './geolocation.handler';

describe('GeolocationHandler', () => {
  let service: GeolocationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationHandler],
    }).compile();

    service = module.get<GeolocationHandler>(GeolocationHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
