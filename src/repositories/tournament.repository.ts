import { EntityRepository, Repository } from 'typeorm';
import { Tournament } from '../entities';

@EntityRepository(Tournament)
export class TournamentRepository extends Repository<Tournament> {}
