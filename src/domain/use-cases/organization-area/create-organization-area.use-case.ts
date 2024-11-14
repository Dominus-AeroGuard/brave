import { Inject, Injectable } from '@nestjs/common';
import { IOrganizationAreaRepository } from '../../../resources/infra/prisma/repositories/organization-area.repository';
import { DOMParser } from '@xmldom/xmldom';

export interface CreateOrganizationAreaRequest {
  file: Express.Multer.File;
  organizationId: number;
}

@Injectable()
export class CreateOrganizationAreaUseCase {
  constructor(
    @Inject('IOrganizationAreaRepository')
    private organizationAreaRepository: IOrganizationAreaRepository,
  ) {}

  async execute(request: CreateOrganizationAreaRequest): Promise<number> {
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

    return await this.organizationAreaRepository.createMany(
      feats,
      request.organizationId,
    );
  }
}
