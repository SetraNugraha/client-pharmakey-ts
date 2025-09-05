export interface Errors {
  field: string;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  isPrev: boolean;
  isNext: boolean;
}
