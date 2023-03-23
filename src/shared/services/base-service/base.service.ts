import { DeleteResult, FindManyOptions, FindOneOptions, In } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { IBaseService } from './base.interface';
import { BaseRepository } from 'src/shared/repo/base.repo/base.repo';
import { _BaseEntity } from 'src/entities';
import { IResponseListRepository, IResponseRepository } from '@/shared/types';

export class BaseService<T extends _BaseEntity> implements IBaseService<T> {
  protected readonly repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async findByIds(
    ids: EntityId[],
    paging: { limit: number; skip: number } = { limit: 16, skip: 0 },
  ): Promise<IResponseListRepository<T>> {
    try {
      const options = {
        where: {
          id: In(ids) as any,
        },
        take: paging.limit,
        skip: paging.skip,
      };
      const signalFindAll = await this.repository.find(options);
      const signalCount = await this.repository.count(options);

      return {
        message: 'get List Sucess',
        data: {
          docs: signalFindAll,
          paging: {
            total: signalCount,
            limit: paging.limit,
            skip: paging.skip + paging.limit,
          },
        },
        error: false,
      };
    } catch (error) {
      return {
        message: 'Get List Success but empty',
        data: {
          docs: [],
          paging: {
            total: 0,
            limit: paging.limit,
            skip: paging.skip + paging.limit,
          },
        },
        error: false,
      };
    }
  }

  async find({
    where,
    select,
    skip,
    take,
    relations,
  }: FindManyOptions<T>): Promise<IResponseListRepository<T>> {
    try {
      const signalFindAll = await this.repository.find({
        where,
        select,
        skip,
        take,
        relations,
      });
      const signalCount = await this.repository.count({ where });

      return {
        message: 'Get List Success',
        data: {
          docs: signalFindAll,
          paging: {
            total: signalCount,
            limit: take,
            skip: skip + take > signalCount ? signalCount : skip + take,
          },
        },
        error: false,
      };
    } catch (error) {
      return {
        message: error.message,
        data: {
          docs: [],
          paging: {
            total: 0,
            limit: take,
            skip: skip,
          },
        },
        error: false,
      };
    }
  }

  async findOne(options: FindOneOptions<T>): Promise<IResponseRepository<T>> {
    try {
      const signalFindOne = await this.repository.findOne(options);
      if (signalFindOne) {
        return {
          message: 'Get Detail Success',
          data: signalFindOne,
          error: false,
        };
      }
      return {
        message: 'Not found data',
        data: null,
        error: false,
      };
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  async findById(id: EntityId): Promise<IResponseRepository<T>> {
    try {
      const signalFindOne = await this.repository.findOne({
        where: {
          id: id as any,
        },
      });
      if (signalFindOne) {
        return {
          message: 'Get Detail Success',
          data: signalFindOne,
          error: false,
        };
      }
      return {
        message: 'Not found data',
        data: null,
        error: false,
      };
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  async store(data: any): Promise<IResponseRepository<T>> {
    try {
      const signalCreate = await this.repository.save(data);
      return {
        message: 'create success',
        data: signalCreate,
        error: false,
      };
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  async update(id: EntityId, data: any): Promise<IResponseRepository<T>> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  count(options: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }
}
