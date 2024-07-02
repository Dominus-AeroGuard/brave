import {
  ApplicationDocument,
  ApplicationDocumentType,
} from '../../../domain/entities/application-document.entity';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { JsonObject } from '@prisma/client/runtime/library';

export interface IApplicationDocumentRepository {
  create(
    data: Array<
      Partial<{
        data: JsonObject;
        path: string;
        originalName: string;
        typeId: number;
        applicationId: number;
      }>
    >,
  ): Promise<Array<ApplicationDocument>>;
  findOne(id: number, applicationId?: number): Promise<ApplicationDocument>;
  update(
    id: number,
    applicationId: number,
    data: Partial<{
      data: JsonObject;
      typeId: number;
    }>,
  ): Promise<ApplicationDocument>;
  remove(application: number, id: number): Promise<void>;
  findAll(applicationId: string): Promise<ApplicationDocument[]>;
}

@Injectable()
export class ApplicationDocumentRepository
  implements IApplicationDocumentRepository
{
  constructor(private prisma: PrismaService) {}

  async findOne(
    id: number,
    applicationId?: number,
  ): Promise<ApplicationDocument> {
    const applicationDocument =
      await this.prisma.applicationDocument.findUnique({
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
    data: Array<
      Partial<{
        data: JsonObject;
        path: string;
        originalName: string;
        typeId: number;
        applicationId: number;
      }>
    >,
  ): Promise<Array<ApplicationDocument>> {
    const result = await this.prisma.applicationDocument.createManyAndReturn({
      data: data.map((d) => ({
        path: d.path,
        data: d.data,
        original_name: d.originalName,
        application_document_type_id: d.typeId,
        application_id: d.applicationId,
      })),
      include: {
        type: true,
      },
    });

    return result.map(this.buildApplicationDocumentEntity);
  }

  async update(
    id: number,
    applicationId: number,
    data: Partial<{
      data: JsonObject;
      typeId: number;
    }>,
  ): Promise<ApplicationDocument> {
    const applicationDocument = await this.prisma.applicationDocument.update({
      where: {
        application_document_id: id,
        application_id: applicationId,
      },
      data: {
        application_document_type_id: data.typeId,
        data: data.data,
      },
      include: {
        type: true,
      },
    });

    return this.buildApplicationDocumentEntity(applicationDocument);
  }

  async remove(id: number, applicationId: number): Promise<void> {
    await this.prisma.applicationDocument.delete({
      where: {
        application_document_id: id,
        application_id: applicationId,
      },
    });
  }

  async findAll(applicationId: string): Promise<ApplicationDocument[]> {
    const documents = await this.prisma.applicationDocument.findMany({
      where: {
        application_id: Number(applicationId),
      },
      include: {
        type: true,
      },
    });

    return documents.map(this.buildApplicationDocumentEntity);
  }

  private buildApplicationDocumentEntity({
    application_document_id,
    original_name,
    path,
    data,
    type,
  }): ApplicationDocument {
    const applicationDocumentType = new ApplicationDocumentType(
      type.application_status_id,
      type.description,
      type.active,
    );

    return new ApplicationDocument(
      application_document_id,
      original_name,
      path,
      data,
      applicationDocumentType,
    );
  }
}
