import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({
    description: 'Papel dentro do sistema',
    type: String,
    required: true,
  })
  role: string;

  @ApiProperty({
    description: 'Papel dentro do sistema',
    type: String,
    required: true,
  })
  description: string;
  @ApiProperty({
    description: 'Indica se role está em uso',
    type: Boolean,
    required: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Indica se a rola é de uma organização',
    type: String,
    required: true,
  })
  organizationRole: boolean;

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
    role: string,
    description: string,
    active: boolean,
    organizationRole: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.role = role;
    this.description = description;
    this.active = active;
    this.organizationRole = organizationRole;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
