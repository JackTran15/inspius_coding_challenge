import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult, FindManyOptions, FindOneOptions } from 'typeorm';
import { IResponseListRepository, IResponseRepository } from '@/shared/types';

export interface IBaseService<T> {
  find(options: FindManyOptions<T>): Promise<IResponseListRepository<T>>;
  findOne(options: FindOneOptions<T>): Promise<IResponseRepository<T>>;
  findById(id: EntityId): Promise<IResponseRepository<T>>;
  findByIds(id: [EntityId]): Promise<IResponseListRepository<T>>;

  store(data: any): Promise<IResponseRepository<T>>;
  update(id: EntityId, data: any): Promise<IResponseRepository<T>>;
  delete(id: EntityId): Promise<DeleteResult>;
}
