import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootballMatch, FootballMatchSchedule, FootballTeam } from './entities';
import { ApiGatewayModule } from './modules/api-gateway-module/api-gateway.module';
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
        entities: [FootballMatch, FootballTeam, FootballMatchSchedule],
        synchronize: true,
      }),
    }),
    ApiGatewayModule,
  ],
})
export class AppModule {}
