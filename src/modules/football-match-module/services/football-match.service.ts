import { Injectable } from '@nestjs/common';
import { FootballMatch } from '@/entities';
import { BaseService } from '@/shared/services/base-service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FootBallMatchRepository } from '@/repositories';
import { IResponseListRepository } from '@/shared/types';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class FootBallMatchService extends BaseService<FootballMatch> {
  constructor(
    @InjectRepository(FootballMatch)
    _footBallMatch: FootBallMatchRepository,
  ) {
    super(_footBallMatch);
  }

  async findDistinctCalendar({
    where,
  }: FindManyOptions<FootballMatch>): Promise<
    IResponseListRepository<FootballMatch>
  > {
    try {
      // create query builder get distinct raw day month year
      const signalFindAll = await this.repository
        .createQueryBuilder('FBM')
        .where(where)
        .select(['FBM.day', 'FBM.month', 'FBM.year'])
        .distinct(true)
        .getRawMany();

      return {
        message: 'Get list Distint Calendar Success',
        data: {
          docs: signalFindAll,
          paging: {
            total: signalFindAll.length,
            limit: null,
            skip: null,
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
            limit: null,
            skip: null,
          },
        },
        error: false,
      };
    }
  }
}
