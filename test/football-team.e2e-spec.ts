import { FootballTeam } from '@/entities';
import { FootballTeamService } from '@/modules';
import { FootBallTeamCreateDto } from '@/modules/football-team-module/dtos/football-team-create.dto';
import { HttpExceptionFilter } from '@/shared/exception-filters/http-exception.filter';
import { ResponseInterceptor } from '@/shared/Interceptors/response.interceptor';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('FootBall Team Controller (e2e)', () => {
  let app: INestApplication;
  let footBallTeamService: FootballTeamService;
  const prefix = '/football-team';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    footBallTeamService =
      moduleFixture.get<FootballTeamService>(FootballTeamService);
  });

  describe('Get List FootBallTeam', () => {
    it(`${prefix} (GET) none Params`, () => {
      // override the implementation of the find method
      const paging = {
        skip: 0,
        limit: 10,
      };

      const size = 20;
      const docs = new Array(size).fill(0).map((_, i) => {
        const team = new FootballTeam();
        return team;
      });
      const pagingDocs = docs.slice(0, paging.limit);

      const responseSuccess = {
        error: false,
        data: {
          docs: pagingDocs,
          paging: {
            total: size,
            skip: paging.limit,
            limit: paging.limit,
          },
        },
        message: 'Get List Success',
      };

      footBallTeamService.find = jest.fn().mockResolvedValue(responseSuccess);

      return request(app.getHttpServer())
        .get(prefix)
        .query(paging)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(responseSuccess);
        });
    });
  });

  describe('Create FootBallTeam', () => {
    it(`${prefix} (Post) full payload`, async () => {
      const payload = new FootBallTeamCreateDto({
        name: 'MU',
        logo: {
          name: 'MU',
          src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          alt: 'MU',
        },
      });

      const responseNewFootBallTeam = {
        message: expect.any(String),
        data: {
          id: expect.any(Number),
          created: '2023-03-14T02:05:49.000Z',
          createdBy: 'Admin',
          updated: '2023-03-14T02:05:49.000Z',
          updatedBy: 'Admin',
          name: payload.name,
          logoName: 'jacknathan',
          logoSrc: 'jacknathan Src',
          status: 'active',
        },
        error: false,
      };

      footBallTeamService.store = jest
        .fn()
        .mockResolvedValue(responseNewFootBallTeam);

      return request(app.getHttpServer())
        .post(`${prefix}/create`)
        .send(payload)
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual(
            JSON.parse(JSON.stringify(responseNewFootBallTeam)),
          );
        });
    });

    it(`${prefix} (Post) no name`, async () => {
      const payload = new FootBallTeamCreateDto({
        logo: {
          name: 'Logo Man City 2',
          src: 'sajdajs',
          alt: 'nasndas',
        },
      });

      const responseData = {
        error: true,
        message: [
          'name must be longer than or equal to 1 characters',
          'name should not be empty',
        ],
        data: null,
      };

      return request(app.getHttpServer())
        .post(`${prefix}/create`)
        .send(payload)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual(responseData);
        });
    });

    it(`${prefix} (Post) no logo`, async () => {
      const payload = new FootBallTeamCreateDto({
        name: 'MU',
      });

      const responseData = {
        error: true,
        message: ['logo must be a non-empty object', 'logo must be an object'],
        data: null,
      };

      return request(app.getHttpServer())
        .post(`${prefix}/create`)
        .send(payload)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual(responseData);
        });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
