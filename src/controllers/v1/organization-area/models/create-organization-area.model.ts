import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationAreaRequest {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to be uploaded',
  })
  file: Express.Multer.File; 
}
