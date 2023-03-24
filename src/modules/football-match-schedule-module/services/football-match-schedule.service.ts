import { FootballMatchSchedule } from '@/entities';
import { FootballMatchScheduleRepository } from '@/repositories';
import { BaseService } from '@/shared/services/base-service/base.service';
import { DateUtil } from '@/shared/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FootBallMatchScheduleService extends BaseService<FootballMatchSchedule> {
  constructor(
    @InjectRepository(FootballMatchSchedule)
    _footBallScheduleMatch: FootballMatchScheduleRepository,
  ) {
    super(_footBallScheduleMatch);
  }

  async getMatchScheduleOrCreated(startMatch: string) {
    try {
      const { year, month, date }: any = DateUtil.get(startMatch, [
        'year',
        'month',
        'date',
      ]);

      const matchScheduleGet = await this.repository.findOne({
        where: {
          year,
          month,
          day: date,
        },
      });

      if (matchScheduleGet)
        return {
          error: false,
          data: matchScheduleGet,
          message: 'schedule found',
        };

      const matchScheduleCreate = await this.repository.save({
        year,
        month,
        day: date,
        dateValue: new Date(startMatch),
      });

      return {
        error: false,
        data: matchScheduleCreate,
        message: 'schedule created',
      };
    } catch (error) {
      return { error: true, message: error.message, data: null };
    }
  }
}
