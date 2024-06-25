import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { CreateApplicationUseCase } from 'src/domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from 'src/domain/use-cases/application/update-application.use-case';
import { ListApplicationUseCase } from 'src/domain/use-cases/application/list-application.use-case';
import { ApplicationRepository } from 'src/infra/prisma/repositories/application.repository';

describe('ApplicationController', () => {
  let controller: ApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        CreateApplicationUseCase,
        UpdateApplicationUseCase,
        ListApplicationUseCase,
        ApplicationRepository,
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
