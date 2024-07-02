import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationDocumentService } from './application-document.service';
import {
  ApplicationDocumentType,
  BucketByDocumentType,
} from '../../../domain/enums/application-document-type.enum';

describe('ApplicationDocumentService', () => {
  let service: ApplicationDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationDocumentService],
    }).compile();

    service = module.get<ApplicationDocumentService>(
      ApplicationDocumentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBucketByDocumentType', () => {
    it('should return the correct bucket for a given document type', () => {
      // Arrange
      const documentType = ApplicationDocumentType.RA;
      const expectedBucket = BucketByDocumentType[documentType];

      // Act
      const result = service.getBucketByDocumentType(documentType);

      // Assert
      expect(result).toEqual(expectedBucket);
    });
  });

  describe('generateFileName', () => {
    it('should generate a unique filename with the correct file extension', () => {
      // Arrange
      const file = {
        originalname: 'example.jpg',
      } as Express.Multer.File;

      // Act
      const result = service.generateFileName(file);

      // Assert
      expect(result).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/,
      );
    });
  });
});
