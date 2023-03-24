import { DataSource } from 'typeorm';
import 'dotenv/config';
import { configService } from './src/shared/services/config.service';
import { FootballMatch, FootballTeam, FootballMatchSchedule } from '@/entities';
import { init1679653973203 } from 'migrations/1679653973203-init';

const listMigrations = [init1679653973203];

export default new DataSource({
  type: 'mysql',
  host: configService.getValue('MYSQL_HOST'),
  port: parseInt(configService.getValue('MYSQL_PORT')),
  username: configService.getValue('MYSQL_USER'),
  password: configService.getValue('MYSQL_PASSWORD'),
  database: configService.getValue('MYSQL_DB'),
  entities: [FootballMatch, FootballTeam,FootballMatchSchedule],
  migrationsTableName: 'migrations',
  migrations: listMigrations,
});
