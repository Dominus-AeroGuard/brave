import { ApiProperty } from '@nestjs/swagger';

export class AnalysisBuffer {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Number })
  analysisId: number;

  @ApiProperty({ description: 'GeoJSON da área da aplicação' })
  applicationAreaGeoJSON: string;

  @ApiProperty({ description: 'GeoJSON do trajeto da aplicação' })
  applicationPathGeoJSON: string;
  
  @ApiProperty({ description: 'GeoJSON das áreas de proteção' })
  protectedAreaGeoJSON: string;

  @ApiProperty({ description: 'GeoJSON das áreas de proteção com buffer' })
  protectedAreaBufferGeoJSON: string;

  constructor(
    id: bigint,
    analysisId: number,
    applicationAreaGeoJSON: string,
    applicationPathGeoJSON: string,
    protectedAreaGeoJSON: string,
    protectedAreaBufferGeoJSON: string,
  ) {
    this.id = id.toString();
    this.analysisId = analysisId;
    this.applicationAreaGeoJSON = applicationAreaGeoJSON;
    this.applicationPathGeoJSON = applicationPathGeoJSON;
    this.protectedAreaGeoJSON = protectedAreaGeoJSON;
    this.protectedAreaBufferGeoJSON = protectedAreaBufferGeoJSON;
  }
}
