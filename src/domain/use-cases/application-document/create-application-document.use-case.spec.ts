import { Test } from '@nestjs/testing';
import {
  ApplicationDocumentRequest,
  CreateApplicationDocumentUseCase,
} from './create-application-document.use-case';
import { IApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';
import { AwsService } from '../../../infra/aws/aws.service';
import { ApplicationDocumentType } from '../../enums/application-document-type.enum';
import { Readable } from 'stream';
import { ApplicationDocumentService } from '../../services/application-document/application-document.service';

describe('CreateApplicationDocumentUseCase', () => {
  const filePath =
    'https://bucket.s3.process.env.region.amazonaws.com/key.file';

  let useCase: CreateApplicationDocumentUseCase;
  let applicationDocumentService: ApplicationDocumentService;
  let repository: IApplicationDocumentRepository;
  let awsService: AwsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateApplicationDocumentUseCase,
        ApplicationDocumentService,
        {
          provide: 'IApplicationDocumentRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AwsService,
          useValue: {
            uploadFile: jest.fn(),
            buildPath: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<CreateApplicationDocumentUseCase>(
      CreateApplicationDocumentUseCase,
    );
    applicationDocumentService = moduleRef.get<ApplicationDocumentService>(
      ApplicationDocumentService,
    );
    repository = moduleRef.get<IApplicationDocumentRepository>(
      'IApplicationDocumentRepository',
    );
    awsService = moduleRef.get<AwsService>(AwsService);
  });

  describe('execute', () => {
    it('should create an application document and return it', async () => {
      // Arrange
      const files: Array<
        Partial<{ file: Express.Multer.File; typeId: number }>
      > = [
        {
          file: {
            fieldname: 'file',
            originalname: 'test-file.txt',
            encoding: '7bit',
            mimetype: 'text/plain',
            size: 1024,
            buffer: Buffer.from('Test file content'),
            stream: new Readable(),
            destination: '',
            filename: '',
            path: '',
          },
          typeId: ApplicationDocumentType.RA,
        },
      ];

      const request: ApplicationDocumentRequest = {
        files,
        applicationId: 123,
      };

      const repositorySpy = {
        create: jest.spyOn(repository, 'create').mockResolvedValue([
          {
            id: 1,
            path: filePath,
            originalName: 'test-file.txt',
            data: {},
            type: {
              id: ApplicationDocumentType.RA,
              description: 'RA',
              active: true,
            },
          },
        ]),
      };

      const awsServiceSpy = {
        uploadFile: jest.spyOn(awsService, 'uploadFile'),
        buildUrl: jest.spyOn(awsService, 'buildPath').mockReturnValue(filePath),
      };

      const applicationDocumentServiceSpy = {
        getBucketByDocumentType: jest
          .spyOn(applicationDocumentService, 'getBucketByDocumentType')
          .mockReturnValue('bucket'),
        generateFileName: jest
          .spyOn(applicationDocumentService, 'generateFileName')
          .mockReturnValue('key.file'),
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(awsServiceSpy.buildUrl).toHaveBeenCalled();
      expect(awsServiceSpy.uploadFile).toHaveBeenCalled();
      expect(
        applicationDocumentServiceSpy.getBucketByDocumentType,
      ).toHaveBeenCalledWith(ApplicationDocumentType.RA);
      expect(
        applicationDocumentServiceSpy.generateFileName,
      ).toHaveBeenCalledWith(files[0].file);
      expect(repositorySpy.create).toHaveBeenCalledWith([
        {
          path: filePath,
          originalName: 'test-file.txt',
          data: {},
          applicationId: 123,
          typeId: ApplicationDocumentType.RA,
        },
      ]);

      expect(result).toEqual([
        {
          id: 1,
          path: filePath,
          originalName: 'test-file.txt',
          data: {},
          type: {
            id: ApplicationDocumentType.RA,
            description: 'RA',
            active: true,
          },
        },
      ]);
    });

    it('should throw an error if the file is not provided', async () => {
      // Arrange
      const request: ApplicationDocumentRequest = {
        files: undefined,
        applicationId: 123,
      };

      // Act
      try {
        await useCase.execute(request);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('File is required');
      }
    });
  });
});
