import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    description: 'Papel que um usuário pode ter no sistema',
    example: 'admin',
  })
  @MinLength(3)
  @MaxLength(30)
  role: string;

  @ApiProperty({
    description: 'Descrição das atribuições da role',
    example: 'Administrador do sistema',
  })
  @MinLength(5)
  @MaxLength(100)
  description: string;
}
