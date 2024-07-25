import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ApplicationDocument } from '../../entities/application-document.entity';
import { ApplicationDocumentType } from '../../enums/application-document-type.enum';
import { ApplicationDocumentService } from '../../services/application-document/application-document.service';
import { AwsService } from '../../../infra/aws/aws.service';
import { IApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';
import { DOMParser } from '@xmldom/xmldom';
import { PrismaClient } from '@prisma/client';
import { Point } from 'geojson'
import { json } from 'stream/consumers';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { IApplicationAreaRepository } from '../../../infra/prisma/repositories/application-area.repository';

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
    private arearepository: IApplicationAreaRepository,
    private awsService: AwsService,
  ) {}

  async execute(
    request: ApplicationDocumentRequest,
  ): Promise<ApplicationDocument[]> {
    await this.throwIfInvalidRequest(request);

    const uploadedFiles = await this.saveFile(request);

    await this.saveApplicationArea(request.applicationId, uploadedFiles);

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
    Array<Partial<{ originalname: string; path: string; typeId: number; buffer: Buffer }>>
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
        buffer: file.file.buffer
      };
    });

    return await Promise.all(promises);
  }

  private async saveApplicationArea(applicationId: number, uploadedFiles: Array<Partial<{ originalname: string; path: string; typeId: number; buffer: Buffer }>>) {
    try {
      const kmlfiles = uploadedFiles.filter(file => file.typeId == Number(ApplicationDocumentType.KML));
      if (kmlfiles?.length > 0){      
        var tj = require('@mapbox/togeojson');

        const kmlString = new DOMParser().parseFromString(String(kmlfiles[0].buffer));
        const geojson = tj.kml(kmlString);

        var feats = [];
        geojson.features.forEach((feature) => {
          if (feature?.geometry?.type ==  'Polygon'){
            const feat = JSON.stringify(feature?.geometry);         
            feats.push(feat);
          } 
          else if (feature?.geometry?.type ==  'GeometryCollection')
          {
            feature?.geometry?.geometries.forEach((geom) => {
              if (geom?.type ==  'Polygon'){
                const feat = JSON.stringify(geom);
                feats.push(feat);  
              }                
            });
          }  
        });
          
        for (let feat of feats){
          const applicationArea = {
            geom: feat,
            description: "",
            applicationId: applicationId,
          };
    
          await this.arearepository.create(applicationArea);
        }
      }    
    } catch (error) {
      console.error(error);
    }
  }
}
