import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { ListDto } from '../../../dtos/list.dto';

export class ListRoleDto extends ListDto {
  @ApiProperty({
    description: 'campo de busca por role e description',
    example: 'admin',
    required: false,
  })
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  q: string;
}
