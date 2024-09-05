import { ApiProperty } from '@nestjs/swagger';

export class ApplicationDocumentType {
  @ApiProperty({ description: 'ID do tipo de documento', example: 1 })
  public id: number;

  @ApiProperty({ description: 'Descrição do tipo de documento', example: 'RA' })
  public description: string;

  @ApiProperty({
    description:
      'Indica se o tipo de documento está ativo para novas inserções',
  })
  public active: boolean;

  constructor(id: number, description: string, active: boolean) {
    this.id = id;
    this.description = description;
    this.active = active;
  }
}

export class ApplicationDocument {
  @ApiProperty({ description: 'ID do documento', example: 1 })
  public id: number;

  @ApiProperty({
    description: 'Nome original do arquivo enviado pelo cliente',
    example: 'file.pdf',
  })
  public originalName: string;

  @ApiProperty({
    description: 'Caminho do arquivo salvo no servidor',
    example: '/path/to/file',
  })
  public path: string;

  @ApiProperty({ description: 'Dados do arquivo extraidos pela OCR' })
  public data: object;

  @ApiProperty({
    description: 'Tipo do documento',
  })
  public type: ApplicationDocumentType;

  constructor(
    id: number,
    originalName: string,
    path: string,
    data: Partial<{ key: string }>,
    type: ApplicationDocumentType,
  ) {
    this.id = id;
    this.originalName = originalName;
    this.path = path;
    this.data = data;
    this.type = type;
  }
}
