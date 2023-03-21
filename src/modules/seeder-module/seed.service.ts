import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FootballMatch,
  FootballMatchSchedule,
  FootballTeam,
  ImageEntity,
  Tournament,
} from '@/entities';
import {
  FootBallMatchRepository,
  FootballMatchScheduleRepository,
  FootBallTeamRepository,
  ImageRepository,
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
    @InjectRepository(ImageEntity) private readonly imageRepo: ImageRepository,
    @InjectRepository(FootballTeam)
    private readonly teamRepo: FootBallTeamRepository,
    @InjectRepository(FootballMatchSchedule)
    private readonly scheduleRepo: FootballMatchScheduleRepository,
    @InjectRepository(FootballMatch)
    private readonly matchRepo: FootBallMatchRepository,
  ) {}

  async seed() {
    // Create 32 team
    const listTeams: Array<FootballTeam> = [];

    const defaultImage =
      'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

    for (const team of listFootBallTeam) {
      const image = await this.imageRepo.save({
        name: team,
        src: defaultImage,
        alt: team,
      });

      const footBallTeam = await this.teamRepo.save({
        name: team,
        logoId: image.id,
      });
      listTeams.push(footBallTeam);
    }

    const payloadTournament = {
      ...tournamentMock,
      teams: listTeams,
    };
    const tournament = await this.tournamentRepo.save(payloadTournament);

    for (const payloadScheduleMatch of listScheduleMatchMock) {
      const { year, month, date, hour, minute }: any = DateUtil.get(
        payloadScheduleMatch,
        ['year', 'month', 'date'],
      );

      let scheduleMatch = await this.scheduleRepo.findOne({
        where: {
          year,
          month,
          day: date,
        },
      });

      scheduleMatch = await this.scheduleRepo.save({
        year,
        month,
        day: date,
        hour,
        minute,
        start: payloadScheduleMatch,
      });

      const homeTeam = listTeams[Math.floor(Math.random() * listTeams.length)];
      const awayTeam = listTeams[Math.floor(Math.random() * listTeams.length)];

      const signalGetMatch = await this.matchRepo.findOne({
        where: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          tournamentId: tournament.id,
          scheduleId: scheduleMatch.id,
        },
      });

      if (signalGetMatch === null) {
        await this.matchRepo.save({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startMatch: payloadScheduleMatch,
          tournamentId: tournament.id,
          scheduleId: scheduleMatch.id,
        });
      }
    }
  }
}
