import { Module } from '@nestjs/common';
import { TournamentService } from './services/tournament.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from '../../entities';
import { TournamentController } from './controllers/tournament.controller';
import { FootBallTeamModule } from '../football-team-module/football-team.module';
import { FootBallMatchModule } from '../football-match-module/football-match.module';
import { ApiKeyModule } from '../api-key-module/api-key.module';

@Module({
  imports: [
    ApiKeyModule,
    FootBallTeamModule,
    FootBallMatchModule,
    TypeOrmModule.forFeature([Tournament]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentTeamModule {}
