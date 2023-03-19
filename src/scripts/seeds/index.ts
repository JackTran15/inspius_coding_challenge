import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: '0.0.0.0',
  port: 3306,
  username: 'master_user',
  password: 'password',
  database: 'lab',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
