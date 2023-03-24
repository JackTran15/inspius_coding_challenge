import { DataSource } from 'typeorm';
import 'dotenv/config';
import { configService } from './src/shared/services/config.service';
import { FootballMatch, FootballTeam, FootballMatchSchedule } from '@/entities';
import { init1679644207118 } from 'migrations/1679644207118-init';
import { updateTypeDatetime1679645372400 } from 'migrations/1679645372400-update-type-datetime';

const listMigrations = [init1679644207118,updateTypeDatetime1679645372400];

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
