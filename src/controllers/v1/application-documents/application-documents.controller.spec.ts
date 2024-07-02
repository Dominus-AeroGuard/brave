import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationDocumentsController } from './application-documents.controller';
import { CreateApplicationDocumentUseCase } from '../../../domain/use-cases/application-document/create-application-document.use-case';
import { IApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';

describe('ApplicationDocumentsController', () => {
  let controller: ApplicationDocumentsController;
  let useCase: CreateApplicationDocumentUseCase;
  let repository: IApplicationDocumentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationDocumentsController],
      providers: [
        {
          provide: CreateApplicationDocumentUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'IApplicationDocumentRepository',
          useValue: {
            update: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationDocumentsController>(
      ApplicationDocumentsController,
    );
    useCase = module.get<CreateApplicationDocumentUseCase>(
      CreateApplicationDocumentUseCase,
    );
    repository = module.get<IApplicationDocumentRepository>(
      'IApplicationDocumentRepository',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an application document', async () => {
      // Arrange
      const files = [
        new File([''], 'example.txt'),
      ] as unknown as Array<Express.Multer.File>;
      const applicationId = '123';
      const applicationDocument = {
        typeId: '1',
      };

      jest.spyOn(useCase, 'execute').mockResolvedValueOnce([
        {
          id: 63,
          originalName: 'example.txt',
          path: 'https://aeroguard-ra.s3.us-east-1.amazonaws.com/fa742fe4-73d3-49f1-9ec2-54f7b5d406ee.txt',
          data: {},
          type: {
            id: 1,
            description: 'RA',
            active: true,
          },
        },
      ]);

      // Act
      await controller.create(files, applicationId, applicationDocument);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith({
        typeId: expect.any(Number),
        applicationId: expect.any(Number),
        files,
      });
    });
  });

  describe('update', () => {
    it('should update an application document', async () => {
      // Arrange
      const applicationId = 123;
      const documentId = 456;
      const updatedDocument = {
        data: {
          key: 'value',
        },
      };
      const applicationDocument = {
        id: documentId,
        originalName: 'example.txt',
        path: 'https://aeroguard-ra.s3.us-east-1.amazonaws.com/fa742fe4-73d3-49f1-9ec2-54f7b5d406ee.txt',
        data: updatedDocument.data,
        type: {
          id: 1,
          description: 'RA',
          active: true,
        },
      };

      jest
        .spyOn(repository, 'update')
        .mockResolvedValueOnce(applicationDocument);

      // Act
      const response = await controller.update(
        updatedDocument,
        applicationId,
        documentId,
      );

      // Assert
      expect(repository.update).toHaveBeenCalledWith(
        Number(documentId),
        Number(applicationId),
        updatedDocument,
      );
      expect(response).toBe(applicationDocument);
    });
  });
});
