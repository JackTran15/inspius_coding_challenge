export interface IPagingRepository {
  total: number;
  limit: number;
  skip: number;
}
export interface IResponseListRepository<T> {
  message: string;
  data: {
    docs: T[];
    paging: IPagingRepository;
  };
  error: boolean;
}
export interface IResponseRepository<T> {
  message: string;
  data: T | null;
  error: boolean;
}
