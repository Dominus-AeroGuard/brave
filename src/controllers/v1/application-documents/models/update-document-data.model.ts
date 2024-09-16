import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmpty } from 'class-validator';

class Data {
  @ApiProperty()
  @IsEmpty()
  key: string;

  @ApiProperty()
  value: string;
}

export class UpdateDocumentDataRequest {
  @ApiProperty()
  @IsArray()
  @Type(() => Array<Data>)
  data: Array<Data>;
}
