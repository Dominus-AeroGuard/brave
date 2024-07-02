import { JsonValue } from '@prisma/client/runtime/library';

export class ApplicationDocumentType {
  constructor(
    public id: number,
    public description: string,
    public active: boolean,
  ) {
    this.id = id;
    this.description = description;
    this.active = active;
  }
}

export class ApplicationDocument {
  constructor(
    public id: number,
    public originalName: string,
    public path: string,
    public data: JsonValue,
    public type: ApplicationDocumentType,
  ) {
    this.id = id;
    this.originalName = originalName;
    this.path = path;
    this.data = data;
    this.type = type;
  }
}
