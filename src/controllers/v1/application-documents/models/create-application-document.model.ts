import { IsEnum, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationDocumentType } from '../../../../domain/enums/application-document-type.enum';
import { Type } from 'class-transformer';

export class CreateApplicationDocumentFileRequest {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to be uploaded',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description:
      'The type ID of the document, must be one of the predefined document type IDs',
    example: 1,
    enum: Object.values(ApplicationDocumentType),
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsEnum(ApplicationDocumentType)
  typeId: number;
}

export class CreateApplicationDocumentRequest {
  @ApiProperty({
    type: [CreateApplicationDocumentFileRequest],
    example: [
      {
        file: 'binary of file',
        typeId: 1,
      },
    ],
    description: 'List of files to be uploaded',
  })
  @ValidateNested()
  @Type(() => CreateApplicationDocumentFileRequest)
  files: Array<CreateApplicationDocumentFileRequest>;
}
