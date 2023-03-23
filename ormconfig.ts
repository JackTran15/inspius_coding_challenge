import { DataSource } from 'typeorm';
import 'dotenv/config';
import { configService } from './src/shared/services/config.service';
import { FootballMatch, FootballTeam, Tournament } from '@/entities';
import { init1679555117612 } from 'migrations/1679555117612-init';

const listMigrations = [init1679555117612];

export default new DataSource({
  type: 'mysql',
  host: configService.getValue('MYSQL_HOST'),
  port: parseInt(configService.getValue('MYSQL_PORT')),
  username: configService.getValue('MYSQL_USER'),
  password: configService.getValue('MYSQL_PASSWORD'),
  database: configService.getValue('MYSQL_DB'),
  entities: [FootballMatch, FootballTeam, Tournament],
  migrationsTableName: 'migrations',
  migrations: listMigrations,
});
