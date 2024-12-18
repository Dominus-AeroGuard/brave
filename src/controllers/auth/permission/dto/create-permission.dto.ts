import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Recurso que a permissão administra',
    example: 'aplication',
  })
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty()
  resource: string;

  @ApiProperty({
    description: 'Ação sobre o recurso que a permissão administra',
    example: 'write',
  })
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: 'Descrição das atribuições da permissão',
    example: 'aplication write',
  })
  @MinLength(5)
  @MaxLength(100)
  @IsNotEmpty()
  description: string;
}
