import { Injectable } from '@nestjs/common';
import { FootballTeam, Tournament } from '@/entities';
import { BaseService } from '@/shared/services/base-service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentRepository } from '@/repositories/tournament.repository';

@Injectable()
export class TournamentService extends BaseService<Tournament> {
  constructor(
    @InjectRepository(Tournament)
    _tournament: TournamentRepository,
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
}
