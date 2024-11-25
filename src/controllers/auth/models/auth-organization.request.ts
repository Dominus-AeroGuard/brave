import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthOrganizationRequest {
  @ApiProperty({
    example: 1,
    description: 'Oganização que deseja se autenticar',
  })
  @IsNotEmpty()
  organizationId: number;
}
