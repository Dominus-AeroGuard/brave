import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';

export class UserOrganization {
  @ApiProperty({
    description: 'Id do usuário associado na organização',
    example: 1,
  })
  user_id: number;

  @ApiProperty({
    description: 'Id da organização',
    example: 1,
  })
  organization_id: number;

  @ApiProperty({
    description: 'Status do usuário',
    example: 'INVITED',
  })
  user_status: string;

  @ApiProperty({
    description: 'Data de criação do usuário na organização',
    example: '2021-09-01T00:00:00.000Z',
  })
  created_at: string;

  constructor(userOrganization: Prisma.UserOrganization, user: Prisma.User) {
    this.user_id = userOrganization.user_id;
    this.organization_id = userOrganization.organization_id;
    this.user_status = user.status;
    this.created_at = userOrganization.created_at.toISOString();
  }
}
