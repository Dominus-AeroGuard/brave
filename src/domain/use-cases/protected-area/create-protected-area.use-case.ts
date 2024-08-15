import { Inject, Injectable } from '@nestjs/common';
import { ProtectedAreaTypeEnum } from 'src/domain/enums/protected-area-type.enum';
import { IProtectedAreaRepository } from 'src/infra/prisma/repositories/protected-area.repository';
import { DOMParser } from '@xmldom/xmldom';

export interface CreateProtectedAreaRequest {
  file: Express.Multer.File;
  description: string;
  typeId: ProtectedAreaTypeEnum;
  organizationId: number;
  userId: number;
}

@Injectable()
export class CreateProtectedAreaUseCase {
  constructor(
    @Inject('IProtectedAreaRepository')
    private protectedAreaRepository: IProtectedAreaRepository,
  ) {}

  async execute(request: CreateProtectedAreaRequest): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tj = require('@mapbox/togeojson');

    const kmlString = new DOMParser().parseFromString(
      String(request.file.buffer),
    );
    const geojson = tj.kml(kmlString);

    const feats = [];
    geojson.features.forEach((feature) => {
      if (feature?.geometry?.type == 'Polygon') {
        const feat = JSON.stringify(feature?.geometry);
        feats.push(feat);
      } else if (feature?.geometry?.type == 'GeometryCollection') {
        feature?.geometry?.geometries.forEach((geom) => {
          if (geom?.type == 'Polygon') {
            const feat = JSON.stringify(geom);
            feats.push(feat);
          }
        });
      }
    });

    return await this.protectedAreaRepository.createMany(
      feats,
      request.description,
      request.typeId,
      request.organizationId,
      request.userId,
    );
  }
}
