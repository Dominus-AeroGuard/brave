import * as Prisma from '@prisma/client';

export class User {
  id: number;

  constructor(user: Prisma.User) {
    this.id = user.user_id;
  }
}
