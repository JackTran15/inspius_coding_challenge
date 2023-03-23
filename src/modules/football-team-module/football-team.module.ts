import { Module } from '@nestjs/common';
import { FootballTeamService } from './services/football-team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootBallTeamController } from './controllers/football-team.controller';
import { FootballTeam } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FootballTeam])],
  controllers: [FootBallTeamController],
  providers: [FootballTeamService],
  exports: [TypeOrmModule, FootballTeamService],
})
export class FootBallTeamModule {}
