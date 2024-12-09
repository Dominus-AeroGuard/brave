import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Papel que um usuário pode ter no sistema',
    example: 'admin',
  })
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'Descrição das atribuições da role',
    example: 'Administrador do sistema',
  })
  @MinLength(5)
  @MaxLength(100)
  @IsNotEmpty()
  description: string;
}
