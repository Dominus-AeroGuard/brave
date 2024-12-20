import { ApiProperty } from '@nestjs/swagger';

export class Permission {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({
    description: 'Recurso gerenciado pela permissão dentro do sistema',
    type: String,
    required: true,
  })
  resource: string;

  @ApiProperty({
    description: 'Ação sobre o recurso gerenciado dentro do sistema',
    type: String,
    required: true,
  })
  action: string;

  @ApiProperty({
    description: 'Permissão dentro do sistema',
    type: String,
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'Indica se a permissão está em uso',
    type: Boolean,
    required: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Indica se a permissão é de uma organização',
    type: String,
    required: true,
  })
  organizationId: number;

  @ApiProperty({
    description: 'Data de criação',
    type: Date,
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    type: Date,
    required: true,
  })
  updatedAt: Date;

  constructor(
    id: number,
    resouce: string,
    action: string,
    description: string,
    active: boolean,
    organizationId: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.resource = resouce;
    this.action = action;
    this.description = description;
    this.active = active;
    this.organizationId = organizationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
