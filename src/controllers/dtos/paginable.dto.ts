import { ApiProperty } from '@nestjs/swagger';

export class Meta {
  @ApiProperty({ description: 'Pagina', example: 1 })
  public page: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  public size: number;

  @ApiProperty({
    description: 'Total de registros encontratos',
    example: 10,
  })
  public countRecords: number;

  @ApiProperty({
    description: 'Total de registros na pagina',
    example: 10,
  })
  public count: number;

  constructor(
    page: number,
    size: number,
    count: number,
    countRecords?: number,
  ) {
    this.page = page;
    this.size = size;
    this.count = count;
    this.countRecords = countRecords ?? count;
  }
}

export class PaginableEntity<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: Meta;

  constructor(
    data: T[],
    meta: { page: number; size: number; countRecords?: number },
  ) {
    this.data = data;
    this.meta = new Meta(meta.page, meta.size, data.length, meta.countRecords);
  }
}
