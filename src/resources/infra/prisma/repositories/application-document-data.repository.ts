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
      FROM "SIGA"."S_DOCUMENTO_DADOS_APLICACAO"
      WHERE ("DS_CHAVE", "DH_CRIACAO") IN (
          SELECT "DS_CHAVE", MAX("DH_CRIACAO") AS max_created_at
          FROM "SIGA"."S_DOCUMENTO_DADOS_APLICACAO"
          GROUP BY "DS_CHAVE"
      )
      AND "ID_DOCUMENTO_APLICACAO" = ${documentId};
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
