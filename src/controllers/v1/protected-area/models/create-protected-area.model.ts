import { IsIn, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProtectedAreaTypeEnum } from '../../../../domain/enums/protected-area-type.enum';
   
export class CreateProtectedAreaRequest {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to be uploaded',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Description of the protected area',
  })
  description: string;

  @ApiProperty({
      description:
        'The type ID of the protected area, must be one of the predefined protected area type IDs',
      example: 1,
      enum: Object.values(ProtectedAreaTypeEnum),
    })
  @IsNotEmpty()
  @IsIn(Object.values(ProtectedAreaTypeEnum).map((v) => v.toString()))
  typeId: number;
}
    