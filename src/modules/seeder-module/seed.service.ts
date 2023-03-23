import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FootballMatch, FootballTeam, Tournament } from '@/entities';
import {
  FootBallMatchRepository,
  FootBallTeamRepository,
  TournamentRepository,
} from '@/repositories';
import { DateUtil } from '@/shared/utils';
import { listFootBallTeam, listScheduleMatchMock } from './__mocks';
import { tournamentMock } from './__mocks/tournament.mock';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepo: TournamentRepository,
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
      const footBallTeam = await this.teamRepo.save({
        name: team,
        logoName: team,
        logoSrc: defaultImage,
      });
      listTeams.push(footBallTeam);
    }

    const payloadTournament = {
      ...tournamentMock,
      teams: listTeams,
    };
    const tournament = await this.tournamentRepo.save(payloadTournament);

    for (const payloadScheduleMatch of listScheduleMatchMock) {
      const { year, month, date }: any = DateUtil.get(payloadScheduleMatch, [
        'year',
        'month',
        'date',
      ]);

      const homeTeam = listTeams[Math.floor(Math.random() * listTeams.length)];
      const awayTeam = listTeams[Math.floor(Math.random() * listTeams.length)];

      const signalGetMatch = await this.matchRepo.findOne({
        where: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          tournamentId: tournament.id,
          day: date,
          month: month,
          year: year,
        },
      });

      if (signalGetMatch === null) {
        await this.matchRepo.save({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startMatch: payloadScheduleMatch,
          tournamentId: tournament.id,
          day: date,
          month: month,
          year: year,
        });
      }
    }
  }
}
