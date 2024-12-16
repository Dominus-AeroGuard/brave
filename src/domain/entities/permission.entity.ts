import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';
import { PermitionActionEnum } from '../enums/permission-action.enum';

export class Permission {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Resource controlado pela permissão' })
  resource: string;

  @ApiProperty({
    enum: Object.values(PermitionActionEnum),
    description: 'Ação permitida sobre o resource controlado pela permissão',
  })
  action: string;

  @ApiProperty({ description: 'Descrição da permissão' })
  description: string;

  constructor(permission: Prisma.Permission) {
    this.id = permission.permission_id;
    this.resource = permission.resource;
    this.action = permission.action;
    this.description = permission.description;
  }
}
