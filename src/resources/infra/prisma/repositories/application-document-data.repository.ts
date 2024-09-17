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
    const fields = await this.findAll(documentId);
    const records = data.map(
      (
        field,
      ): Partial<{
        document_id: number;
        key: string;
        value: string;
        revision: number;
        created_by: number;
      }> => {
        const documentData = fields.find(({ key }) => key === field.key);

        let revision = 1;

        if (documentData) {
          revision = documentData.revision++;
        }

        return {
          ...field,
          document_id: documentId,
          revision,
          created_by: createdBy,
        };
      },
    );

    const result =
      await this.prisma.applicationDocumentData.createManyAndReturn({
        data: records.map(
          ({ document_id, key, value, revision, created_by }) => ({
            document_id,
            key,
            value,
            revision,
            created_by,
          }),
        ),
      });

    return result.map(this.buildApplicationDocumentDataEntity);
  }

  async findAll(documentId: number): Promise<ApplicationDocumentData[]> {
    const records: DocumentDataModel[] = await this.prisma.$queryRaw`
      SELECT *
      FROM application_document_data
      WHERE (key, revision) IN (
          SELECT key, MAX(revision) AS max_revision
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
    revision,
    created_by,
    created_at,
  }): ApplicationDocumentData {
    return new ApplicationDocumentData(
      key,
      value,
      revision,
      created_by,
      created_at,
    );
  }
}
