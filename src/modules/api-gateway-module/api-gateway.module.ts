import { Module } from '@nestjs/common';
import { ApiKeyModule } from '../api-key-module/api-key.module';
import { FootBallMatchModule } from '../football-match-module';
import { FootBallMatchScheduleModule } from '../football-match-schedule-module/football-match-schedule.module';
import { FootBallTeamModule } from '../football-team-module';
import { ApiGatewayController } from './controllers';

@Module({
  imports: [
    ApiKeyModule,
    FootBallTeamModule,
    FootBallMatchModule,
    FootBallMatchScheduleModule,
  ],
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule {}
