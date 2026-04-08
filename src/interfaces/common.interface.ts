export interface IStandartResponse {
  message: string;
}

export interface IWithPagination<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IAPIResponse<T> {
  data: T;
}
