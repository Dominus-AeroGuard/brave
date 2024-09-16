import { Test, TestingModule } from '@nestjs/testing';
import {
  UpdateDocumentDataRequest,
  UpdateDocumentDataUseCase,
} from './update-document-data.use-case';
import { ApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';
import { ApplicationDocumentDataRepository } from '../../../infra/prisma/repositories/application-document-data.repository';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApplicationDocumentType } from '../../../domain/enums/application-document-type.enum';

describe('UpdateDocumentDataUseCase', () => {
  let useCase: UpdateDocumentDataUseCase;
  let documentRepository: ApplicationDocumentRepository;
  let documentDataRepository: ApplicationDocumentDataRepository;

  const mockDocumentRepository = {
    applicationDocument: {
      findUnique: jest.fn(),
    },
    findOne: jest.fn(),
  };

  const mockDocumentDataRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDocumentDataUseCase,
        {
          provide: 'IApplicationDocumentRepository',
          useValue: mockDocumentRepository,
        },
        {
          provide: 'IApplicationDocumentDataRepository',
          useValue: mockDocumentDataRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateDocumentDataUseCase>(UpdateDocumentDataUseCase);
    documentRepository = module.get('IApplicationDocumentRepository');
    documentDataRepository = module.get('IApplicationDocumentDataRepository');
  });

  describe('execute', () => {
    it('should update document data', async () => {
      // Arrange
      const request: UpdateDocumentDataRequest = {
        data: [{ key: 'nome_usuario', value: 'validValue' }],
        createdBy: 1,
        applicationId: 1,
        documentId: 1,
      };

      mockDocumentRepository.applicationDocument.findUnique.mockResolvedValue({
        type: { application_document_type_id: ApplicationDocumentType.RA },
      });

      mockDocumentRepository.findOne.mockResolvedValue({ id: 1 });

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual({ id: 1 });
      expect(
        documentRepository.applicationDocument.findUnique,
      ).toHaveBeenCalled();
      expect(documentDataRepository.create).toHaveBeenCalledWith(
        1,
        1,
        request.data,
      );
    });

    it('should throw an exception when document not found', async () => {
      // Arrange
      const request: UpdateDocumentDataRequest = {
        data: [{ key: 'nome_usuario', value: 'validValue' }],
        createdBy: 1,
        applicationId: 1,
        documentId: 1,
      };

      mockDocumentRepository.applicationDocument.findUnique.mockResolvedValue(
        null,
      );

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(NotFoundException);

      expect(documentDataRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an exception when document type is not have data do update', async () => {
      // Assert
      const request: UpdateDocumentDataRequest = {
        data: [{ key: 'invalidKey', value: 'validValue' }],
        createdBy: 1,
        applicationId: 1,
        documentId: 1,
      };

      mockDocumentRepository.applicationDocument.findUnique.mockResolvedValue({
        type: { application_document_type_id: ApplicationDocumentType.KML },
      });

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(documentDataRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an exception when key is not mapped', async () => {
      // Assert
      const request: UpdateDocumentDataRequest = {
        data: [{ key: 'invalidKey', value: 'validValue' }],
        createdBy: 1,
        applicationId: 1,
        documentId: 1,
      };

      mockDocumentRepository.applicationDocument.findUnique.mockResolvedValue({
        type: { application_document_type_id: ApplicationDocumentType.RA },
      });

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(documentDataRepository.create).not.toHaveBeenCalled();
    });
  });
});
