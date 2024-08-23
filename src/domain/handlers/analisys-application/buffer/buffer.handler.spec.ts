import { Test, TestingModule } from '@nestjs/testing';
import { BufferHandler } from './buffer.handler';

describe('BufferHandler', () => {
  let service: BufferHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BufferHandler, 
        {
          provide: 'IApplicationAnalisysRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'IProtectedAreaRepository',
          useValue: {
            findByDistance: jest.fn(),
          },
        },      
        {
          provide: 'IProtectedAreaTypeRepository',
          useValue: {
            findAll: jest.fn(),
          },
        },      
      ],
    }).compile();

    service = module.get<BufferHandler>(BufferHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
