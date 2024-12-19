import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { ListDto } from '../../../dtos/list.dto';

export class ListPermissionDto extends ListDto {
  @ApiProperty({
    description: 'campo de busca por resource e action',
    example: 'aplication-write',
    required: false,
  })
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  q: string;
}
