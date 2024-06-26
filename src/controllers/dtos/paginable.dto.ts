export class PaginableEntity<T> {
  data: T[];
  meta: {
    page: number;
    size: number;
  };

  constructor(data: T[], meta: { page: number; size: number }) {
    this.data = data;
    this.meta = meta;
  }
}
