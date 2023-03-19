import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootBallMatchService } from './services';
import { FootballMatch } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FootballMatch])],
  providers: [FootBallMatchService],
  exports: [TypeOrmModule, FootBallMatchService],
})
export class FootBallMatchModule {}
