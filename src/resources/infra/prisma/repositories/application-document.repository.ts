import {
  ApplicationDocument,
  ApplicationDocumentType,
} from '../../../../domain/entities/application-document.entity';
import { PrismaService } from '../prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { IApplicationDocumentDataRepository } from './application-document-data.repository';

export interface IApplicationDocumentRepository {
  create(
    data: Partial<{
      path: string;
      originalName: string;
      data: Array<
        Partial<{
          key: string;
          value: string;
          created_by: number;
        }>
      >;
      typeId: number;
      applicationId: number;
    }>,
  ): Promise<ApplicationDocument>;
  findOne(id: number, applicationId?: number): Promise<ApplicationDocument>;
  update(
    id: number,
    applicationId: number,
    data: Partial<{
      typeId: number;
    }>,
  ): Promise<ApplicationDocument>;
  remove(application: number, id: number): Promise<void>;
  findAll(applicationId: string): Promise<ApplicationDocument[]>;
}

@Injectable()
export class ApplicationDocumentRepository
  extends PrismaService
  implements IApplicationDocumentRepository
{
  constructor(
    @Inject('IApplicationDocumentDataRepository')
    private documentDataRepository: IApplicationDocumentDataRepository,
  ) {
    super();
  }

  async findOne(
    id: number,
    applicationId?: number,
  ): Promise<ApplicationDocument> {
    const applicationDocument = await this.applicationDocument.findUnique({
      where: {
        application_document_id: id,
        application_id: applicationId,
      },
      include: {
        type: true,
      },
    });

    return this.buildApplicationDocumentEntity(applicationDocument);
  }

  async create(
    data: Partial<{
      path: string;
      originalName: string;
      data: Array<
        Partial<{
          key: string;
          value: string;
          created_by: number;
        }>
      >;
      typeId: number;
      applicationId: number;
    }>,
  ): Promise<ApplicationDocument> {
    const result = await this.applicationDocument.create({
      data: {
        path: data.path,
        original_name: data.originalName,
        application_document_type_id: data.typeId,
        application_id: data.applicationId,
        data: {
          createMany: {
            data: data.data.map(({ key, value, created_by }) => ({
              key,
              value,
              created_by,
            })),
          },
        },
      },
      include: {
        type: true,
      },
    });

    return this.findOne(result.application_document_id);
  }

  async update(
    id: number,
    applicationId: number,
    data: Partial<{
      typeId: number;
    }>,
  ): Promise<ApplicationDocument> {
    const applicationDocument = await this.applicationDocument.update({
      where: {
        application_document_id: id,
        application_id: applicationId,
      },
      data: {
        application_document_type_id: data.typeId,
      },
      include: {
        type: true,
      },
    });

    return this.buildApplicationDocumentEntity(applicationDocument);
  }

  async remove(id: number, applicationId: number): Promise<void> {
    await this.applicationDocument.delete({
      where: {
        application_document_id: id,
        application_id: applicationId,
      },
    });
  }

  async findAll(applicationId: string): Promise<ApplicationDocument[]> {
    const documents = await this.applicationDocument.findMany({
      where: {
        application_id: Number(applicationId),
      },
      include: {
        type: true,
      },
    });

    return Promise.all(documents.map(this.buildApplicationDocumentEntity));
  }

  private buildApplicationDocumentEntity = async ({
    application_document_id,
    original_name,
    path,
    type,
  }): Promise<ApplicationDocument> => {
    const applicationDocumentType = new ApplicationDocumentType(
      type.application_document_type_id,
      type.description,
      type.active,
    );

    const documentData = await this.documentDataRepository.findAll(
      application_document_id,
    );

    const data = documentData.reduce((prev, curr) => {
      if (!prev[curr.key]) {
        prev[curr.key] = curr.value;
      }

      return prev;
    }, {});

    return new ApplicationDocument(
      application_document_id,
      original_name,
      path,
      data,
      applicationDocumentType,
    );
  };
}
