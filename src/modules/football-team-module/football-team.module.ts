import { Module } from '@nestjs/common';
import { FootballTeamService } from './services/football-team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootBallTeamController } from './controllers/football-team.controller';
import { FootballTeam } from '../../entities/football-team.entity';
import { ImageModule } from '../image-module/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([FootballTeam]), ImageModule],
  controllers: [FootBallTeamController],
  providers: [FootballTeamService],
  exports: [TypeOrmModule, FootballTeamService],
})
export class FootBallTeamModule {}
