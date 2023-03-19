import { Injectable } from '@nestjs/common';
import { FootballMatch } from '@/entities';
import { BaseService } from '@/shared/services/base-service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FootBallMatchRepository } from '@/repositories';

@Injectable()
export class FootBallMatchService extends BaseService<FootballMatch> {
  constructor(
    @InjectRepository(FootballMatch)
    _footBallMatch: FootBallMatchRepository,
  ) {
    super(_footBallMatch);
  }
}
