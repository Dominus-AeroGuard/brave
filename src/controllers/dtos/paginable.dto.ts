import { ApiProperty } from '@nestjs/swagger';

export class Meta {
  @ApiProperty({ description: 'Pagina', example: 1 })
  public page: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  public size: number;

  constructor(page: number, size: number) {
    this.page = page;
    this.size = size;
  }
}

export class PaginableEntity<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: Meta;

  constructor(data: T[], meta: { page: number; size: number }) {
    this.data = data;
    this.meta = new Meta(meta.page, meta.size);
  }
}
