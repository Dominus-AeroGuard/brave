import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ApplicationDocument } from '../../entities/application-document.entity';
import { ApplicationDocumentType } from '../../enums/application-document-type.enum';
import { ApplicationDocumentService } from '../../services/application-document/application-document.service';
import { AwsService } from '../../../infra/aws/aws.service';
import { IApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';

export interface ApplicationDocumentRequest {
  files: Array<
    Partial<{
      file: Express.Multer.File;
      typeId: ApplicationDocumentType;
    }>
  >;
  applicationId: number;
}

@Injectable()
export class CreateApplicationDocumentUseCase {
  constructor(
    private applicationDocumentService: ApplicationDocumentService,
    @Inject('IApplicationDocumentRepository')
    private repository: IApplicationDocumentRepository,
    private awsService: AwsService,
  ) {}

  async execute(
    request: ApplicationDocumentRequest,
  ): Promise<ApplicationDocument[]> {
    await this.throwIfInvalidRequest(request);

    const uploadedFiles = await this.saveFile(request);

    const applicationDocuments = uploadedFiles.map((file) => ({
      path: file.path,
      originalName: file.originalname,
      data: {},
      typeId: file.typeId,
      applicationId: request.applicationId,
    }));

    return await this.repository.create(applicationDocuments);
  }

  private async throwIfInvalidRequest(request: ApplicationDocumentRequest) {
    if (!request.files?.length)
      throw new BadRequestException('File is required');
  }

  private async saveFile(
    request: ApplicationDocumentRequest,
  ): Promise<
    Array<Partial<{ originalname: string; path: string; typeId: number }>>
  > {
    const promises = request.files.map(async (file) => {
      const key = this.applicationDocumentService.generateFileName(file.file);
      const bucket = this.applicationDocumentService.getBucketByDocumentType(
        file.typeId,
      );

      await this.awsService.uploadFile(file.file.buffer, bucket, key);

      return {
        originalname: file.file.originalname,
        typeId: file.typeId,
        path: this.awsService.buildPath(bucket, key),
      };
    });

    return await Promise.all(promises);
  }
}