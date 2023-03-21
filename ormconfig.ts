import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';
import { configService } from './src/shared/services/config.service';
import { FootballMatch, FootballMatchSchedule, FootballTeam, ImageEntity, Tournament } from '@/entities';
import { init1679399340126 } from 'migrations/1679399340126-init';

const listMigrations = [init1679399340126];

export default new DataSource({
  type: 'mysql',
  host: configService.getValue('MYSQL_HOST'),
  port: parseInt(configService.getValue('MYSQL_PORT')),
  username: configService.getValue('MYSQL_USER'),
  password: configService.getValue('MYSQL_PASSWORD'),
  database: configService.getValue('MYSQL_DB'),
  entities: [FootballMatch, FootballMatchSchedule, FootballTeam, ImageEntity, Tournament],
  migrationsTableName: 'migrations',
  migrations: listMigrations,
});
