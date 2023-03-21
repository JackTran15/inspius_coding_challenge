import {
  FootballMatch,
  FootballMatchSchedule,
  FootballTeam,
  ImageEntity,
  Tournament,
} from '@/entities';
import { configService } from '@/shared/services/config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';

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
        entities: [
          FootballMatch,
          FootballMatchSchedule,
          FootballTeam,
          ImageEntity,
          Tournament,
        ],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      Tournament,
      ImageEntity,
      FootballMatch,
      FootballMatchSchedule,
      FootballTeam,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
