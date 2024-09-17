import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationDocumentsController } from './application-documents.controller';
import { CreateApplicationDocumentUseCase } from '../../../domain/use-cases/application-document/create-application-document.use-case';
import { IApplicationDocumentRepository } from '../../../resources/infra/prisma/repositories/application-document.repository';
import { CreateApplicationDocumentRequest } from './models/create-application-document.model';
import { UpdateDocumentDataUseCase } from '../../../domain/use-cases/application-document/update-document-data.use-case';

describe('ApplicationDocumentsController', () => {
  let controller: ApplicationDocumentsController;
  let useCase: CreateApplicationDocumentUseCase;
  let updateDataUseCase: UpdateDocumentDataUseCase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          provide: UpdateDocumentDataUseCase,
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
    updateDataUseCase = module.get<UpdateDocumentDataUseCase>(
      UpdateDocumentDataUseCase,
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
        files: [{ typeId: 1, file: files[0] }],
      } as unknown as CreateApplicationDocumentRequest;

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
        applicationId: 123,
        files: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should update an application document', async () => {
      // Arrange
      const applicationId = 123;
      const documentId = 456;
      const documentData = {
        data: [{ key: 'nome_usuario', value: 'nome' }],
      };
      const applicationDocument = {
        id: 63,
        originalName: 'example.txt',
        path: 'https://aeroguard-ra.s3.us-east-1.amazonaws.com/fa742fe4-73d3-49f1-9ec2-54f7b5d406ee.txt',
        data: {},
        type: {
          id: 1,
          description: 'RA',
          active: true,
        },
      };

      jest
        .spyOn(updateDataUseCase, 'execute')
        .mockResolvedValueOnce(applicationDocument);

      // Act
      const response = await controller.update(
        { user: { userId: 1 } },
        documentData,
        applicationId,
        documentId,
      );

      // Assert
      expect(updateDataUseCase.execute).toHaveBeenCalledWith({
        documentId: Number(documentId),
        applicationId: Number(applicationId),
        createdBy: 1,
        data: documentData.data,
      });
      expect(response).toBe(applicationDocument);
    });
  });
});
