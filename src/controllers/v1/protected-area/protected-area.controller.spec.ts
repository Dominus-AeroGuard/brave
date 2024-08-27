import { Test, TestingModule } from '@nestjs/testing';
import { ProtectedAreaController } from './protected-area.controller';
import { CreateProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/create-protected-area.use-case';
import { ProtectedAreaRepository } from '../../../infra/prisma/repositories/protected-area.repository';

describe('ProtectedAreaController', () => {
  let controller: ProtectedAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtectedAreaController],
      providers: [
        {
          provide: CreateProtectedAreaUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProtectedAreaRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProtectedAreaController>(ProtectedAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
