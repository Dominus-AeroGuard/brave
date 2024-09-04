import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';
import { ApplicationDocumentType } from '../../../../domain/entities/application-document.entity';

export class UpdateApplicationDocumentRequest {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @IsEnum(ApplicationDocumentType)
  typeId: number;
}
