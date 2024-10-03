import { Injectable } from '@nestjs/common';
import { ApplicationDocumentData } from '../../../../domain/entities/application-document-data.entity';
import { ApplicationDocumentData as DocumentDataModel } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export interface IApplicationDocumentDataRepository {
  create(
    documentId: number,
    createdBy: number,
    data: Array<
      Partial<{
        key: string;
        value: string;
      }>
    >,
  ): Promise<ApplicationDocumentData[]>;
  findAll(documentId: number): Promise<ApplicationDocumentData[]>;
}

@Injectable()
export class ApplicationDocumentDataRepository
  implements IApplicationDocumentDataRepository
{
  constructor(private prisma: PrismaService) {}
  async create(
    documentId: number,
    createdBy: number,
    data: Array<
      Partial<{
        key: string;
        value: string;
      }>
    >,
  ): Promise<ApplicationDocumentData[]> {
    const result =
      await this.prisma.applicationDocumentData.createManyAndReturn({
        data: data.map(({ key, value }) => ({
          document_id: documentId,
          created_by: createdBy,
          key,
          value,
        })),
      });

    return result.map(this.buildApplicationDocumentDataEntity);
  }

  async findAll(documentId: number): Promise<ApplicationDocumentData[]> {
    const records: DocumentDataModel[] = await this.prisma.$queryRaw`
      SELECT *
      FROM application_document_data
      WHERE (key, created_at) IN (
          SELECT key, MAX(created_at) AS max_created_at
          FROM application_document_data
          GROUP BY key
      )
      AND document_Id = ${documentId};
    `;

    return records.map(this.buildApplicationDocumentDataEntity);
  }

  private buildApplicationDocumentDataEntity({
    key,
    value,
    created_by,
    created_at,
  }): ApplicationDocumentData {
    return new ApplicationDocumentData(key, value, created_by, created_at);
  }
}
