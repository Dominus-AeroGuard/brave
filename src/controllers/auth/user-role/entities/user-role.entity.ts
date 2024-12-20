import { ApiProperty } from '@nestjs/swagger';

export class UserRole {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({
    description: 'Papel dentro do sistema',
    type: String,
    required: true,
  })
  role: string;

  @ApiProperty({
    description: 'Organização que a role é vinculada',
    type: Number,
    required: true,
  })
  organizationId: number;

  constructor(id: number, role: string, organizationId: number) {
    this.id = id;
    this.role = role;
    this.organizationId = organizationId;
  }
}
