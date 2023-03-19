import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';
import { configService } from './src/shared/services/config.service';

const listMigrations = [join(__dirname, 'src', 'migrations', '*.{ts,js}')];

export default new DataSource({
  type: 'mysql',
  host: configService.getValue('MYSQL_HOST'),
  port: parseInt(configService.getValue('MYSQL_PORT')),
  username: configService.getValue('MYSQL_USER'),
  password: configService.getValue('MYSQL_PASSWORD'),
  database: configService.getValue('MYSQL_DB'),
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrationsTableName: 'migrations',
  migrations: listMigrations,
});
