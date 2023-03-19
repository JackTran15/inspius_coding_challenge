import { EntityRepository, Repository } from 'typeorm';
import { FootballTeam } from '../entities';

@EntityRepository(FootballTeam)
export class FootBallTeamRepository extends Repository<FootballTeam> {}
