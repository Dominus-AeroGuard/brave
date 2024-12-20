import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({
    description: 'Lista de roles a serem associadas ao usuário',
    example: [1, 2],
  })
  @IsArray()
  @IsNotEmpty()
  data: number[];
}
