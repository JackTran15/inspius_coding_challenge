import { Module } from '@nestjs/common';
import { FootBallTeamModule } from './modules/football-team-module/football-team.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentTeamModule } from './modules/tournament-module/tournament.module';
import { configService } from './shared/services/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: configService.getValue('MYSQL_HOST'),
        port: parseInt(configService.getValue('MYSQL_PORT')),
        username: configService.getValue('MYSQL_USER'),
        password: configService.getValue('MYSQL_PASSWORD'),
        database: configService.getValue('MYSQL_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    FootBallTeamModule,
    TournamentTeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
