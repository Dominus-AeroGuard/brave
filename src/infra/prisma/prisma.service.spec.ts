import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should connect to the database', async () => {
    // arrange
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockResolvedValueOnce();

    // act
    await prismaService.onModuleInit();

    // assert
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should disconnect from the database', async () => {
    // arrange
    const disconectSpy = jest
      .spyOn(prismaService, '$disconnect')
      .mockResolvedValueOnce();

    // act
    await prismaService.onModuleDestroy();

    // assert
    expect(disconectSpy).toHaveBeenCalled();
  });
});
