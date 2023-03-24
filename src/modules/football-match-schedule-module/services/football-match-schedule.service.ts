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
    const { year, month, date }: any = DateUtil.get(startMatch, [
      'year',
      'month',
      'date',
    ]);

    const matchSchedule = await this.repository.findOne({
      where: {
        year,
        month,
        day: date,
      },
    });

    if (matchSchedule) return matchSchedule;

    const signalMatchSchedule = await this.repository.save({
      year,
      month,
      day: date,
      dateValue: new Date(startMatch),
    });
    return signalMatchSchedule;
  }
}
