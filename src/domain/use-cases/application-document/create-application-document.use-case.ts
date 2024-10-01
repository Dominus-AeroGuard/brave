import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ApplicationDocument } from '../../entities/application-document.entity';
import { ApplicationDocumentType } from '../../enums/application-document-type.enum';
import { ApplicationDocumentService } from '../../services/application-document/application-document.service';
import { AwsService } from '../../../resources/infra/aws/aws.service';
import { OcrService } from '../../../resources/infra/http/ocr/ocr.service';
import { IApplicationDocumentRepository } from '../../../resources/infra/prisma/repositories/application-document.repository';
import { DOMParser } from '@xmldom/xmldom';
import { IApplicationAreaRepository } from '../../../resources/infra/prisma/repositories/application-area.repository';
import { IApplicationPathRepository } from '../../../resources/infra/prisma/repositories/application-path.repository';

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
    @Inject('IApplicationAreaRepository')
    private areaRepository: IApplicationAreaRepository,
    @Inject('IApplicationPathRepository')
    private pathRepository: IApplicationPathRepository,
    private awsService: AwsService,
    private ocrService: OcrService,
  ) {}

  async execute(
    request: ApplicationDocumentRequest,
  ): Promise<ApplicationDocument[]> {
    await this.throwIfInvalidRequest(request);

    const promises = request.files.map((file) =>
      this.saveFile(request.applicationId, file),
    );

    return await Promise.all(promises);
  }

  private async throwIfInvalidRequest(request: ApplicationDocumentRequest) {
    if (!request.files?.length)
      throw new BadRequestException('File is required');
  }

  private async saveFile(
    applicationId: number,
    file: Partial<{
      file: Express.Multer.File;
      typeId: ApplicationDocumentType;
    }>,
  ): Promise<ApplicationDocument> {
    const uploadedFile = await this.uploadFile(file);
    let documentData = [];

    if (
      [
        Number(ApplicationDocumentType.RA),
        Number(ApplicationDocumentType.RO),
      ].includes(file.typeId)
    ) {
      documentData = await this.extractDocumentData(file);
    }

    if ([Number(ApplicationDocumentType.KML)].includes(file.typeId)) {
      await this.saveApplicationArea(applicationId, file);
    }

    return this.repository.create({
      path: uploadedFile.path,
      originalName: uploadedFile.originalname,
      data: documentData,
      typeId: file.typeId,
      applicationId,
    });
  }

  private async saveApplicationArea(
    applicationId: number,
    file: Partial<{
      file: Express.Multer.File;
      typeId: ApplicationDocumentType;
    }>,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tj = require('@mapbox/togeojson');

      const kmlString = new DOMParser().parseFromString(
        String(file.file.buffer),
      );

      const geojson = tj.kml(kmlString);
      const featsPolygon = [];
      const featsLine = [];
      geojson.features.forEach((feature) => {
        if (feature?.geometry?.type == 'Polygon') {
          const feat = JSON.stringify(feature?.geometry);
          featsPolygon.push(feat);
        } else if (feature?.geometry?.type == 'LineString') {
          const feat = JSON.stringify(feature?.geometry);
          featsLine.push(feat); 
        } else if (feature?.geometry?.type == 'GeometryCollection') {
          feature?.geometry?.geometries.forEach((geom) => {
            if (geom?.type == 'Polygon') {
              const feat = JSON.stringify(geom);
              featsPolygon.push(feat);
            } else if (feature?.geometry?.type == 'LineString') {
              const feat = JSON.stringify(feature?.geometry);
              featsLine.push(feat); 
            }
          });
        }
      });

      if (featsPolygon.length > 0){
        await this.areaRepository.createMany(featsPolygon, '', applicationId);
      }

      if (featsLine.length > 0){
        await this.pathRepository.createMany(featsLine, '', applicationId);
      }

    } catch (error) {
      console.error(error);
    }
  }

  private async extractDocumentData(
    file: Partial<{
      file: Express.Multer.File;
      typeId: ApplicationDocumentType;
    }>,
  ): Promise<
    Array<
      Partial<{
        key: string;
        value: string;
        created_by: number;
      }>
    >
  > {
    const data = await this.ocrService.extractDocumentData({
      file: file.file,
      type: ApplicationDocumentType[file.typeId].toString(),
    });

    return Object.values(data)
      .filter((value) => !!value)
      .reduce((prev, curr) => {
        Object.keys(curr).map((key) => {
          prev.push({
            key,
            value: curr[key] || '',
            created_by: 1, // TODO: pegar o usuário do context holder
          });
        });

        return prev;
      }, []);
  }

  private async uploadFile(
    file: Partial<{
      file: Express.Multer.File;
      typeId: ApplicationDocumentType;
    }>,
  ): Promise<
    Partial<{
      originalname: string;
      path: string;
      typeId: number;
      buffer: Buffer;
    }>
  > {
    const key = this.applicationDocumentService.generateFileName(file.file);
    const bucket = this.applicationDocumentService.getBucketByDocumentType(
      file.typeId,
    );

    await this.awsService.uploadFile(file.file.buffer, bucket, key);

    return {
      originalname: file.file.originalname,
      typeId: file.typeId,
      path: this.awsService.buildPath(bucket, key),
      buffer: file.file.buffer,
    };
  }
}
