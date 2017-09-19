export interface PageOptions {
  sort: string;
  order: SortOrder;
  no: number;
  size: number;
}

export enum SortOrder {
  asc,
  desc
}
