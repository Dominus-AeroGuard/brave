import { ApiProperty } from '@nestjs/swagger';

export class ApplicationDocumentData {
  @ApiProperty({
    description: 'Chave do documento',
    example: 'nome',
  })
  key: string;

  @ApiProperty({
    description: 'Valor associado à chave',
    example: 'Este é o valor do documento.',
  })
  value: string;

  @ApiProperty({
    description: 'Número da revisão do documento',
    example: 1,
  })
  revision: number;

  @ApiProperty({
    description: 'ID do usuário que criou o documento',
    example: 123,
  })
  createdBy: number;

  @ApiProperty({
    description: 'Data de criação do documento',
    example: '2024-08-26T15:30:00Z',
  })
  createdAt: Date;

  constructor(
    key: string,
    value: string,
    revision: number,
    createdBy: number,
    createdAt: Date,
  ) {
    this.key = key;
    this.value = value;
    this.revision = revision;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}