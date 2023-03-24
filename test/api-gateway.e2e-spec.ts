import { FootballTeam } from '@/entities';
import { FootballTeamService } from '@/modules';
import { FootBallMatchScheduleService } from '@/modules/football-match-schedule-module/services';
import { FootBallTeamCreateDto } from '@/modules/football-team-module/dtos/football-team-create.dto';
import { HttpExceptionFilter } from '@/shared/exception-filters/http-exception.filter';
import { ResponseInterceptor } from '@/shared/Interceptors/response.interceptor';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API GATEWAY (e2e)', () => {
  let app: INestApplication;
  let scheduleService: FootBallMatchScheduleService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    scheduleService =
      moduleFixture.get<FootBallMatchScheduleService>(FootBallMatchScheduleService);

    scheduleService =
      moduleFixture.get<FootBallMatchScheduleService>(FootBallMatchScheduleService);
  });

  describe('GET /match', () => {
    it('should return 200 when params is valid', () => {
      scheduleService.find = jest.fn().mockResolvedValue('test result')

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), skip: 0, limit: 30 })
        .expect(200)


      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date() })
        .expect(200)

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), skip: 1 })
        .expect(200)

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), limit: 30 })
        .expect(200)
    })

    it('should return 400 when params is invalid', () => {
      scheduleService.find = jest.fn().mockResolvedValue('test result')

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), skip: 0, limit: 30 })
        .expect(400)

      request(app.getHttpServer())
        .get('/match')
        .query({ endDate: new Date(), skip: 0, limit: 30 })
        .expect(400)

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), skip: -1, limit: 30 })
        .expect(400)


      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), skip: 'rand_string', limit: 30 })
        .expect(400)

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), skip: 1, limit: 'rand_string' })
        .expect(400)

      request(app.getHttpServer())
        .get('/match')
        .query({ startDate: new Date(), endDate: new Date(), skip: NaN, limit: -10 })
        .expect(400)

      request(app.getHttpServer())
        .get('/match')
        .expect(400)
    })
  })

  describe('GET /calendar', () => {
    const url = '/match'
    it('should return 200 when params is valid', () => {
      scheduleService.find = jest.fn().mockResolvedValue('test result')

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), skip: 0, limit: 30 })
        .expect(200)


      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date() })
        .expect(200)

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), skip: 1 })
        .expect(200)

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), limit: 30 })
        .expect(200)
    })

    it('should return 400 when params is invalid', () => {
      scheduleService.find = jest.fn().mockResolvedValue('test result')

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), skip: 0, limit: 30 })
        .expect(400)

      request(app.getHttpServer())
        .get(url)
        .query({ endDate: new Date(), skip: 0, limit: 30 })
        .expect(400)

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), skip: -1, limit: 30 })
        .expect(400)


      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), skip: 'rand_string', limit: 30 })
        .expect(400)

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), skip: 1, limit: 'rand_string' })
        .expect(400)

      request(app.getHttpServer())
        .get(url)
        .query({ startDate: new Date(), endDate: new Date(), skip: NaN, limit: -10 })
        .expect(400)

      request(app.getHttpServer())
        .get(url)
        .expect(400)
    })
  })

  afterAll(async () => {
    await app.close();
  });
});
