import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApplicationDocumentDataRepository } from '../../../infra/prisma/repositories/application-document-data.repository';
import { ApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';
import { DocumentKeysEnum } from '../../../domain/enums/document-data-keys.enum';
import { ApplicationDocument } from '../../../domain/entities/application-document.entity';

export interface UpdateDocumentDataRequest {
  data: Array<
    Partial<{
      key: string;
      value: string;
    }>
  >;
  createdBy: number;
  applicationId: number;
  documentId: number;
}

@Injectable()
export class UpdateDocumentDataUseCase {
  constructor(
    @Inject('IApplicationDocumentRepository')
    private documentRepository: ApplicationDocumentRepository,
    @Inject('IApplicationDocumentDataRepository')
    private documentDataRepository: ApplicationDocumentDataRepository,
  ) {}

  async execute(
    request: UpdateDocumentDataRequest,
  ): Promise<ApplicationDocument> {
    await this.throwIfInvalid(request);

    const data = request.data.filter(({ value }) => !!value);

    await this.documentDataRepository.create(
      request.documentId,
      request.createdBy,
      data,
    );

    return await this.documentRepository.findOne(request.documentId);
  }

  async throwIfInvalid(request: UpdateDocumentDataRequest) {
    const document =
      await this.documentRepository.applicationDocument.findUnique({
        where: {
          application_document_id: request.documentId,
          application_id: request.applicationId,
        },
        include: {
          type: true,
        },
      });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    const keysEnum =
      DocumentKeysEnum[document.type.application_document_type_id];

    if (!keysEnum) {
      throw new UnprocessableEntityException({
        message: `Documento tipo ${document.type.description} não tem valores cadastradados que permitam atualização`,
      });
    }

    const notAllowedKeysForDocument = request.data.filter(
      (data) => !keysEnum.includes(data.key),
    );

    if (notAllowedKeysForDocument.length) {
      throw new UnprocessableEntityException({
        message: `As chaves ${notAllowedKeysForDocument.map(({ key }) => key).join(',')} não são permitidas para o documento ${document.type.description}`,
      });
    }
  }
}
