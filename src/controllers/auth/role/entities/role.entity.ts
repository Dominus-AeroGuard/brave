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
    description: 'Organização que a role é vinculada',
    type: Number,
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
    role: string,
    description: string,
    active: boolean,
    organizationId: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.role = role;
    this.description = description;
    this.active = active;
    this.organizationId = organizationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
