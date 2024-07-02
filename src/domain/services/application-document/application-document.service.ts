import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ApplicationDocumentType,
  BucketByDocumentType,
} from '../../enums/application-document-type.enum';

@Injectable()
export class ApplicationDocumentService {
  getBucketByDocumentType(documentType: ApplicationDocumentType): string {
    return BucketByDocumentType[documentType];
  }

  generateFileName(file: Express.Multer.File): string {
    const fileExtension = file.originalname.split('.').pop();

    return `${randomUUID()}.${fileExtension}`;
  }
}
