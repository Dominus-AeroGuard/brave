import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';

export class User {
  @ApiProperty()
  public id: number;

  @ApiProperty();
  public name: string;

  constructor(user: Prisma.User) {
    this.id = user.user_id;
    this.name = user.name;
  }
}
