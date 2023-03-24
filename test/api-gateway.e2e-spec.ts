import { AppModule } from '@/app.module';
import { FootBallMatchService } from '@/modules';

import { ResponseInterceptor } from '@/shared/Interceptors/response.interceptor';
import { HttpExceptionFilter } from '@/shared/exception-filters/http-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('Tournament Controller (e2e)', () => {
  let app: INestApplication;
  let footBallMatchService: FootBallMatchService;
  const prefix = '/tournament';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    footBallMatchService =
      moduleFixture.get<FootBallMatchService>(FootBallMatchService);
  });

  describe('Get List Tournament Calendar', () => {
    it(`${prefix} (GET) none Params`, async () => {
      const responseSuccess = {
        error: false,
        data: {
          docs: [
            {
              id: 11,
              day: 14,
              month: 2,
              year: 2023,
              countMatch: 10,
            },
            {
              id: 12,
              day: 14,
              month: 3,
              year: 2023,
              countMatch: 10,
            },
          ],
          paging: {
            total: 12,
            skip: 2,
            limit: 2,
          },
        },
        message: 'Get List Match Schedule',
      };

      const signalScheduleMatch = {
        error: false,
        data: {
          docs: [
            {
              id: 11,
              day: 14,
              month: 2,
              year: 2023,
            },
            {
              id: 12,
              day: 14,
              month: 3,
              year: 2023,
            },
          ],
          paging: {
            total: 12,
            limit: 2,
            skip: 2,
          },
        },
        message: 'Get List Success',
      };

      // footBallMatchScheduleService.find = jest
      //   .fn()
      //   .mockResolvedValue(signalScheduleMatch);

      footBallMatchService.count = jest.fn().mockResolvedValue(10);

      return request(app.getHttpServer())
        .get(`${prefix}/calendar`)
        .expect(200)
        .expect(responseSuccess);
    });

    it(`${prefix} (GET) with Params`, async () => {
      const paging = {
        skip: 0,
        limit: 10,
      };

      const date = {
        day: 14,
        month: 2,
        year: 2023,
      };

      const query = {
        ...paging,
        ...date,
      };

      const docs = [
        {
          id: 11,
          day: 20,
          month: 2,
          year: 2023,
          countMatch: 10,
        },
      ];

      const responseSuccess = {
        error: false,
        data: {
          docs: docs,
          paging: {
            total: 1,
            skip:
              paging.skip + docs.length > paging.limit
                ? paging.limit
                : docs.length,
            limit: paging.limit,
          },
        },
        message: 'Get List Match Schedule',
      };

      const docsSchedule = docs.map((doc) => {
        return {
          id: doc.id,
          day: doc.day,
          month: doc.month,
          year: doc.year,
        };
      });
      const signalScheduleMatch = {
        error: false,
        data: {
          docs: docsSchedule,
          paging: {
            total: docsSchedule.length,
            limit: paging.limit,
            skip:
              paging.skip + docsSchedule.length > paging.limit
                ? paging.limit
                : docsSchedule.length,
          },
        },
        message: 'Get List Success',
      };

      // footBallMatchScheduleService.find = jest
      //   .fn()
      //   .mockResolvedValue(signalScheduleMatch);

      footBallMatchService.count = jest.fn().mockResolvedValue(10);

      return request(app.getHttpServer())
        .get(`${prefix}/calendar`)
        .expect(200)
        .query(query)
        .expect(responseSuccess);
    });
  });

  describe('Get List Tournament Math with calender', () => {
    const paging = {
      skip: 0,
      limit: 10,
    };

    const date = {
      day: 14,
      month: 2,
      year: 2023,
    };

    const query = {
      ...paging,
      ...date,
    };

    it(`${prefix} (GET) none Query Params`, async () => {
      const docsSchedule = [
        {
          id: 11,
          day: 14,
          month: 2,
          year: 2023,
        },
      ];

      const signalScheduleMatch = {
        error: false,
        data: {
          docs: docsSchedule,
          paging: {
            total: docsSchedule.length,
            limit: paging.limit,
            skip:
              paging.skip + docsSchedule.length > paging.limit
                ? paging.limit
                : docsSchedule.length,
          },
        },
        message: 'Get List Match Schedule',
      };

      const docsMatch = [
        {
          listMatch: {
            docs: expect.any(Array),
            paging: { total: 1, limit: 10, skip: 1 },
          },
        },
      ];

      const signalMatch = {
        error: false,
        data: {
          docs: docsMatch,
          paging: {
            total: docsMatch.length,
            limit: paging.limit,
            skip:
              paging.skip + docsMatch.length > paging.limit
                ? paging.limit
                : docsMatch.length,
          },
        },
        message: 'Get List Match Schedule',
      };

      const expectedGetMatch = {
        error: false,
        data: {
          docs: expect.any(Array),
          paging: expect.any(Object),
        },
        message: 'Get List Match Schedule',
      };

      // footBallMatchScheduleService.find = jest
      //   .fn()
      //   .mockResolvedValue(signalScheduleMatch);

      footBallMatchService.find = jest.fn().mockResolvedValue(signalMatch);

      return request(app.getHttpServer())
        .get(`${prefix}/match`)
        .expect(200)
        .then((res) => {
          expect(res.body).toMatchObject(expectedGetMatch);
        });
    });

    it(`${prefix} (GET) with Query Params Invalid Date`, async () => {
      const statusCode = 400;
      const queryParamsInvalidDate = {
        day: 'XIV',
        month: 'II',
        year: 'MMXXIII',
      };

      const signalErrorRes = {
        error: true,
        message: [
          'day must be a number string',
          'month must be a number string',
          'year must be a number string',
        ],
        data: null,
      };
      return request(app.getHttpServer())
        .get(`${prefix}/match`)
        .query(queryParamsInvalidDate)
        .expect(statusCode)
        .expect(signalErrorRes);
    });

    it(`${prefix} (GET) with Query Params Invalid Paging`, async () => {
      const statusCode = 400;
      const queryParamsInvalidDate = {
        skip: 'ámdas',
        limit: '16ámdas',
      };

      const signalErrorRes = {
        error: true,
        message: [
          'skip must be a number string',
          'limit must be a number string',
        ],
        data: null,
      };
      return request(app.getHttpServer())
        .get(`${prefix}/match`)
        .query(queryParamsInvalidDate)
        .expect(statusCode)
        .expect(signalErrorRes);
    });
  });

  describe('Tournament (Match Arrangement)', () => {
    it(`${prefix} (Post) full payload do not create match existed`, async () => {
      const statusCode = 201;
      const tournamentId = 1;
      const url = `${prefix}/match-arrangement`;

      const matchOne = {
        homeTeam: 80,
        awayTeam: 74,
        matchStartTime: '2023-03-15T03:11:30.748Z',
      };

      const matchTwo = {
        homeTeam: 80,
        awayTeam: 99,
        matchStartTime: '2023-03-25T03:12:17.420Z',
      };

      const body = {
        tournamentId: tournamentId,
        matchs: [matchOne],
      };

      const responseNewMatchs = [];
      const responseExistMatchs = [];

      const signalFootBallMatchScheduleExistSuccess = {
        message: expect.any(String),
        data: {
          id: 1,
        },
        error: false,
      };

      const signalFootBallMatchScheduleSuccess = {
        message: 'Get Detail Success',
        data: {
          homeTeamId: 80,
          awayTeamId: 99,
          startMatch: '2023-03-25T03:12:17.420Z',
          tournamentId: 7,
          scheduleId: 22,
          id: 70,
          created: '2023-03-15T23:49:15.000Z',
          createdBy: 'Admin',
          updated: '2023-03-15T23:49:15.000Z',
          updatedBy: 'Admin',
          scoreHome: 0,
          scoreAway: 0,
          status: 'pending',
        },
        error: false,
      };

      const signalFootBallMatchScheduleNotFound = {
        message: 'Not found data',
        data: null,
        error: false,
      };

      const signalFootBallMatchScheduleStoreSuccess = {
        message: expect.any(String),
        data: {
          homeTeamId: 80,
          awayTeamId: 74,
          startMatch: '2023-03-15T03:11:30.748Z',
          tournamentId: 7,
          scheduleId: 21,
          id: 69,
          created: '2023-03-15T23:49:15.000Z',
          createdBy: 'Admin',
          updated: '2023-03-15T23:49:15.000Z',
          updatedBy: 'Admin',
          scoreHome: 0,
          scoreAway: 0,
          status: 'pending',
        },
        error: false,
      };

      responseNewMatchs.push(signalFootBallMatchScheduleStoreSuccess.data);

      const signalResponse = {
        error: false,
        data: {
          newMatchs: responseNewMatchs,
          existMatchs: responseExistMatchs,
        },
        message: 'Match arrangement',
      };

      footBallMatchScheduleService.getMatchScheduleOrCreated = jest
        .fn()
        .mockResolvedValue(signalFootBallMatchScheduleExistSuccess);

      footBallMatchService.findOne = jest
        .fn()
        .mockResolvedValue(signalFootBallMatchScheduleSuccess) // for the first call
        .mockResolvedValueOnce(signalFootBallMatchScheduleNotFound); // for the second call

      footBallMatchService.store = jest
        .fn()
        .mockResolvedValue(signalFootBallMatchScheduleStoreSuccess);

      return request(app.getHttpServer())
        .post(url)
        .send(body)
        .expect(statusCode)
        .then((res) => {
          expect(res.body).toEqual(JSON.parse(JSON.stringify(signalResponse)));
        });
    });

    it(`${prefix} (Post) full payload do not create match and match exist`, async () => {
      const statusCode = 201;
      const tournamentId = 1;
      const url = `${prefix}/match-arrangement`;

      const matchOne = {
        homeTeam: 80,
        awayTeam: 74,
        matchStartTime: '2023-03-15T03:11:30.748Z',
      };

      const matchTwo = {
        homeTeam: 80,
        awayTeam: 99,
        matchStartTime: '2023-03-25T03:12:17.420Z',
      };

      const body = {
        tournamentId: tournamentId,
        matchs: [matchOne, matchTwo],
      };

      const responseNewMatchs = [];
      const responseExistMatchs = [];

      const signalFootBallMatchScheduleExistSuccess = {
        message: expect.any(String),
        data: {
          id: 1,
        },
        error: false,
      };

      const signalFootBallMatchScheduleSuccess = {
        message: 'Get Detail Success',
        data: {
          homeTeamId: 80,
          awayTeamId: 99,
          startMatch: '2023-03-25T03:12:17.420Z',
          tournamentId: 7,
          scheduleId: 22,
          id: 70,
          created: '2023-03-15T23:49:15.000Z',
          createdBy: 'Admin',
          updated: '2023-03-15T23:49:15.000Z',
          updatedBy: 'Admin',
          scoreHome: 0,
          scoreAway: 0,
          status: 'pending',
        },
        error: false,
      };

      const signalFootBallMatchScheduleNotFound = {
        message: 'Not found data',
        data: null,
        error: false,
      };

      const signalFootBallMatchScheduleStoreSuccess = {
        message: expect.any(String),
        data: {
          homeTeamId: 80,
          awayTeamId: 74,
          startMatch: '2023-03-15T03:11:30.748Z',
          tournamentId: 7,
          scheduleId: 21,
          id: 69,
          created: '2023-03-15T23:49:15.000Z',
          createdBy: 'Admin',
          updated: '2023-03-15T23:49:15.000Z',
          updatedBy: 'Admin',
          scoreHome: 0,
          scoreAway: 0,
          status: 'pending',
        },
        error: false,
      };

      responseExistMatchs.push(signalFootBallMatchScheduleSuccess.data);

      responseNewMatchs.push(signalFootBallMatchScheduleStoreSuccess.data);

      const signalResponse = {
        error: false,
        data: {
          newMatchs: responseNewMatchs,
          existMatchs: responseExistMatchs,
        },
        message: 'Match arrangement',
      };

      footBallMatchScheduleService.getMatchScheduleOrCreated = jest
        .fn()
        .mockResolvedValue(signalFootBallMatchScheduleExistSuccess);

      footBallMatchService.findOne = jest
        .fn()
        .mockResolvedValue(signalFootBallMatchScheduleSuccess) // for the first call
        .mockResolvedValueOnce(signalFootBallMatchScheduleNotFound); // for the second call

      footBallMatchService.store = jest
        .fn()
        .mockResolvedValue(signalFootBallMatchScheduleStoreSuccess);

      return request(app.getHttpServer())
        .post(url)
        .send(body)
        .expect(statusCode)
        .then((res) => {
          expect(res.body).toEqual(JSON.parse(JSON.stringify(signalResponse)));
        });
    });
  });
});
