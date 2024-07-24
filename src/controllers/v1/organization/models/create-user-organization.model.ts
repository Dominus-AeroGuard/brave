import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserOrganizationRequest {
  @ApiProperty({
    example: 1,
    description: 'Id do usuário que será vinculado a organização',
  })
  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
