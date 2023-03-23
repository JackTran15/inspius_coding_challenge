import { Injectable } from '@nestjs/common';
import { FootballTeam } from '@/entities';
import { FootBallTeamRepository } from '@/repositories/football-team.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@/shared/services/base-service/base.service';

@Injectable()
export class FootballTeamService extends BaseService<FootballTeam> {
  constructor(
    @InjectRepository(FootballTeam)
    _footballTeam: FootBallTeamRepository,
  ) {
    super(_footballTeam);
  }
}
