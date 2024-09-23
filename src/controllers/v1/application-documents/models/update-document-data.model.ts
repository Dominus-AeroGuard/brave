import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

class Data {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}

export class UpdateDocumentDataRequest {
  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => Data)
  data: Array<Data>;
}
