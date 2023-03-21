import { Injectable } from '@nestjs/common';
import { FootballTeam, Tournament } from '@/entities';
import { BaseService } from '@/shared/services/base-service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentRepository } from '@/repositories/tournament.repository';
import { ImageService } from '@/modules/image-module';
import { FootballTeamService } from '@/modules/football-team-module';
import { FootBallMatchService } from '@/modules/football-match-module';
import { FootBallMatchScheduleService } from '@/modules/football-match-schedule-module';

@Injectable()
export class TournamentService extends BaseService<Tournament> {
  constructor(
    @InjectRepository(Tournament)
    _tournament: TournamentRepository,

    private readonly _imageService: ImageService,
    private readonly _footBallTeamService: FootballTeamService,
    private readonly _footBallMatchService: FootBallMatchService,
    private readonly _footBallMatchScheduleService: FootBallMatchScheduleService,
  ) {
    super(_tournament);
  }

  async registerFootBallTeams(tournament: Tournament, teams: FootballTeam[]) {
    try {
      const tournamentTeams = tournament.teams;

      const newTournamentTeams = (tournamentTeams || []).concat(...teams);
      tournament.teams = newTournamentTeams;
      const signalUpdateTournament = await tournament.save();
      return {
        message: 'Update Tournament',
        data: signalUpdateTournament,
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

  async seed() {
    // Create 32 team
    const listTeam = [
      'MU',
      'MC',
      'PSG',
      'LFC',
      'RM',
      'BAR',
      'ATM',
      'JUV',
      'MIL',
      'INT',
      'LAZ',
      'ROM',
      'NAP',
      'SAS',
      'LAC',
      'LUD',
      'BAY',
      'DOR',
      'BVB',
      'SCH',
      'BRE',
      'WOL',
      'FIO',
      'SAMP',
      'GEN',
      'UDI',
      'CAG',
      'SPE',
      'TOR',
      'CRO',
      'SAS',
      'BOL',
    ];

    const listTeams = [];

    for (const team of listTeam) {
      const signalImage = await this._imageService.store({
        name: team,
        src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        alt: team,
      });
      if (signalImage.error) throw new Error("Can't create image");
      const image = signalImage.data;

      const signalFootBallTeam = await this._footBallTeamService.store({
        name: team,
        logoId: image.id,
      });
      listTeams.push(signalFootBallTeam.data);
    }

    // Create tournament
    const signalTournament = await this.store({
      name: 'Champions League',
      start: '2023-03-13T10:22:02.643Z',
      end: '2023-06-13T10:22:55.674Z',
      teams: listTeams,
    });

    const tournament = signalTournament.data;

    // schedule Match
    const payloadScheduleMatchs = [
      '2023-03-14T03:11:30.748Z',
      '2023-03-14T03:11:30.748Z',
      '2023-03-14T03:11:30.748Z',
      '2023-03-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
    ];

    for (const payloadScheduleMatch of payloadScheduleMatchs) {
      const signalScheduleMatch =
        await this._footBallMatchScheduleService.getMatchScheduleOrCreated(
          payloadScheduleMatch,
        );

      const homeTeam = listTeams[Math.floor(Math.random() * listTeams.length)];
      const awayTeam = listTeams[Math.floor(Math.random() * listTeams.length)];

      const signalGetMatch = await this._footBallMatchService.findOne({
        where: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          tournamentId: tournament.id,
          scheduleId: signalScheduleMatch.id,
        },
      });

      if (!signalGetMatch.error && signalGetMatch.data === null) {
        await this._footBallMatchService.store({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startMatch: payloadScheduleMatch,
          tournamentId: tournament.id,
          scheduleId: signalScheduleMatch.id,
        });
      }
    }
  }
}
