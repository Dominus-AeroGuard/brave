import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationDocumentType } from '../../../../domain/enums/application-document-type.enum';

export class CreateApplicationDocumentRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(Object.values(ApplicationDocumentType).map((v) => v.toString()))
  readonly typeId: string;
}
