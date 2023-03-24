import { FootballMatchSchedule } from '@/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootBallMatchScheduleService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([FootballMatchSchedule])],
  providers: [FootBallMatchScheduleService],
  exports: [FootBallMatchScheduleService],
})
export class FootBallMatchScheduleModule {}
