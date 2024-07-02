import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { JsonObject } from '@prisma/client/runtime/library';

export class UpdateApplicationDocumentRequest {
  @ApiProperty()
  @IsNotEmptyObject()
  data: JsonObject;
}
