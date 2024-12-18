import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { MaxLength, MinLength } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'Recurso que a permissão administra',
    example: 'aplication',
  })
  @MinLength(3)
  @MaxLength(30)
  resource: string;

  @ApiProperty({
    description: 'Ação sobre o recurso que a permissão administra',
    example: 'write',
  })
  @MinLength(3)
  @MaxLength(30)
  action: string;

  @ApiProperty({
    description: 'Descrição das atribuições da permissão',
    example: 'aplication write',
  })
  @MinLength(5)
  @MaxLength(100)
  description: string;
}
