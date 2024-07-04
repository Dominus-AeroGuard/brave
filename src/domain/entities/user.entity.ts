import { ApiProperty } from '@nestjs/swagger';
import * as Prisma from '@prisma/client';

export class User {
  @ApiProperty()
  public id: number;

  constructor(user: Prisma.User) {
    this.id = user.user_id;
  }
}
