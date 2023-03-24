import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FootballMatch, FootballMatchSchedule, FootballTeam } from '@/entities';
import {
  FootBallMatchRepository,
  FootballMatchScheduleRepository,
  FootBallTeamRepository,
} from '@/repositories';
import { DateUtil } from '@/shared/utils';
import { listFootBallTeam, listScheduleMatchMock } from './__mocks';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(FootballMatchSchedule)
    private readonly footballMatchScheduletRepo: FootballMatchScheduleRepository,

    @InjectRepository(FootballTeam)
    private readonly teamRepo: FootBallTeamRepository,

    @InjectRepository(FootballMatch)
    private readonly matchRepo: FootBallMatchRepository,
  ) {}

  async seed() {
    // Create 32 team
    const listTeams: Array<FootballTeam> = [];

    const defaultImage =
      'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

    for (const team of listFootBallTeam) {
      const _team = await this.teamRepo.save({
        name: team,
        logoName: team,
        logoSrc: defaultImage,
      });
      listTeams.push(_team);
    }

    for (const payloadScheduleMatch of listScheduleMatchMock) {
      const { year, month, date }: any = DateUtil.get(payloadScheduleMatch, [
        'year',
        'month',
        'date',
      ]);
      let schedule = await this.footballMatchScheduletRepo.findOne({
        where: {
          day: date,
          month: month,
          year: year,
        },
      });

      if (!schedule) {
        schedule = await this.footballMatchScheduletRepo.save({
          day: date,
          month: month,
          year: year,
          dateValue: payloadScheduleMatch,
        });
      }

      const homeTeam = listTeams[Math.floor(Math.random() * listTeams.length)];
      const awayTeam = listTeams[Math.floor(Math.random() * listTeams.length)];

      const signalGetMatch = await this.matchRepo.findOne({
        where: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          day: date,
          month: month,
          year: year,
          scheduleId: schedule.id,
        },
      });

      if (signalGetMatch === null) {
        await this.matchRepo.save({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startMatch: payloadScheduleMatch,
          day: date,
          month: month,
          year: year,
          scheduleId: schedule.id,
        });
      }
    }
  }
}
