import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ListDto {
  @ApiProperty({
    description: 'Pagina',
    example: 1,
    required: false,
    default: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    default: 10,
    required: false,
    example: 10,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  public size: number = 10;
}
