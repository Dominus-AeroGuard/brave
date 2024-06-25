import * as Prisma from '@prisma/client';

export class Pilot {
  id: number;
  name: string;
  document: string;
  license: string;

  constructor(pilot: Prisma.Pilot) {
    this.id = pilot.pilot_id;
    this.name = pilot.name;
    this.document = pilot.document;
    this.license = pilot.license;
  }
}
