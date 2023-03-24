import { FootballMatch, FootballMatchSchedule, FootballTeam } from '@/entities';
import { FootBallMatchService } from '@/modules/football-match-module';
import { FootBallMatchScheduleService } from '@/modules/football-match-schedule-module/services';
import { FootballTeamService } from '@/modules/football-team-module';
import { DateUtil } from '@/shared/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Between, FindManyOptions, In, Repository } from 'typeorm';
import { ApiGatewayController } from './api-gateway.controller';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({}),
);

describe('API Gateway controller', () => {
  let controller: ApiGatewayController;

  let footBalLTeamService: FootballTeamService;
  let footBallTeamRepository: MockType<Repository<FootballTeam>>;

  let footBallMatchService: FootBallMatchService;
  let footBallMatchRepository: MockType<Repository<FootballMatch>>;

  let footballMatchScheduleService: FootBallMatchScheduleService;
  let footballMatchScheduleRepository: MockType<
    Repository<FootballMatchSchedule>
  >;

  const paging = {
    limit: 10,
    skip: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ApiGatewayController],
      providers: [
        FootballTeamService,
        {
          provide: getRepositoryToken(FootballTeam),
          useFactory: repositoryMockFactory,
        },
        FootBallMatchService,
        {
          provide: getRepositoryToken(FootballMatch),
          useFactory: repositoryMockFactory,
        },
        FootBallMatchScheduleService,
        {
          provide: getRepositoryToken(FootballMatchSchedule),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<ApiGatewayController>(ApiGatewayController);

    footBalLTeamService = module.get<FootballTeamService>(FootballTeamService);
    footBallTeamRepository = module.get(getRepositoryToken(FootballTeam));

    footBallMatchService =
      module.get<FootBallMatchService>(FootBallMatchService);
    footBallMatchRepository = module.get(getRepositoryToken(FootballMatch));

    footballMatchScheduleService = module.get<FootBallMatchScheduleService>(
      FootBallMatchScheduleService,
    );
    footballMatchScheduleRepository = module.get(
      getRepositoryToken(FootballMatchSchedule),
    );
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should all service be defined', () => {
    expect(footBalLTeamService).toBeDefined();
    expect(footBallMatchService).toBeDefined();
  });

  describe('Tournament (GET) Get List Tournament Calendar', () => {
    it('should return list data Calendar of tournament', async () => {
      const startDate = new Date('2023-03-01');
      const endDate = new Date('2023-03-28');
      const query = {
        startDate,
        endDate,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };
      const start = DateUtil.setReset(startDate);
      const end = DateUtil.setReset(endDate, false);

      const queryCritia: FindManyOptions<FootballMatchSchedule> = {
        where: {
          dateValue: Between(start.toDate(), end.toDate()),
        },
        select: ['day', 'month', 'year'],
        order: {
          dateValue: 'ASC',
        },
      };
      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const size = 20;
      const docs = new Array(size)
        .fill(0)
        .map((_) => new FootballMatchSchedule());

      const expectedListMatchSchedule = {
        message: 'Get List Success',
        error: false,
        data: {
          docs: docs,
          paging: expect.any(Object),
        },
      };

      // mock function repositoty
      footballMatchScheduleRepository.find = jest
        .fn()
        .mockResolvedValueOnce(docs);
      footballMatchScheduleRepository.count = jest
        .fn()
        .mockResolvedValueOnce(size);

      const resListMatchSchedule = await controller.getCalendar(_paging, {
        ...query,
        ..._paging,
      });

      expect(resListMatchSchedule).toEqual(expectedListMatchSchedule);
      expect(footballMatchScheduleRepository.find).toBeCalledWith(queryCritia);
    });

    it('should return dont find schedule in query', async () => {
      const startDate = new Date('2023-03-01');
      const endDate = new Date('2023-03-28');
      const query = {
        startDate,
        endDate,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };
      const start = DateUtil.setReset(startDate);
      const end = DateUtil.setReset(endDate, false);

      const queryCritia: FindManyOptions<FootballMatchSchedule> = {
        where: {
          dateValue: Between(start.toDate(), end.toDate()),
        },
        select: ['day', 'month', 'year'],
        order: {
          dateValue: 'ASC',
        },
      };
      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const size = 0;
      const docs = new Array(size)
        .fill(0)
        .map((_) => new FootballMatchSchedule());

      const expectedListMatchSchedule = {
        message: 'Get List Success',
        error: false,
        data: {
          docs: docs,
          paging: expect.any(Object),
        },
      };

      // mock function repositoty
      footballMatchScheduleRepository.find = jest
        .fn()
        .mockResolvedValueOnce(docs);
      footballMatchScheduleRepository.count = jest
        .fn()
        .mockResolvedValueOnce(size);

      const resListMatchSchedule = await controller.getCalendar(_paging, {
        ...query,
        ..._paging,
      });

      expect(resListMatchSchedule).toEqual(expectedListMatchSchedule);
      expect(footballMatchScheduleRepository.find).toBeCalledWith(queryCritia);
    });
  });

  describe('Tournament (GET) Get List Tournament Match', () => {
    it('should return list data Football Math of tournament', async () => {
      const startDate = new Date('2023-03-01');
      const endDate = new Date('2023-03-28');
      const query = {
        startDate,
        endDate,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };
      const start = DateUtil.setReset(startDate);
      const end = DateUtil.setReset(endDate, false);

      const queryCritia: FindManyOptions<FootballMatch> = {
        where: {
          startMatch: Between(start.toDate(), end.toDate()),
        },
        take: _paging.limit,
        skip: _paging.skip,
        select: {
          id: true,
          day: true,
          month: true,
          year: true,
          startMatch: true,
          scoreAway: true,
          scoreHome: true,
          homeTeam: {
            id: true,
            name: true,
          },
          awayTeam: {
            id: true,
            name: true,
          },
        },
        relations: {
          awayTeam: true,
          homeTeam: true,
        },
        order: {
          startMatch: 'ASC',
        },
      };
      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const size = 20;
      const docs = new Array(size)
        .fill(0)
        .map((_) => new FootballMatchSchedule());

      const expectedListMatchSchedule = {
        message: 'Get List Match Success',
        error: false,
        data: {
          docs: docs,
          paging: expect.any(Object),
        },
      };

      // mock function repositoty
      footBallMatchRepository.find = jest.fn().mockResolvedValueOnce(docs);
      footBallMatchRepository.count = jest.fn().mockResolvedValueOnce(size);

      const signalMatchArrangement = await controller.getMatch(_paging, {
        ...query,
        ..._paging,
      });

      expect(signalMatchArrangement).toEqual(expectedListMatchSchedule);
      expect(footBallMatchRepository.find).toHaveBeenCalledWith(queryCritia);
      expect(footBallMatchRepository.count).toHaveBeenCalledWith({
        where: queryCritia.where,
      });
    });

    it('should return list empty data Football Math of tournament', async () => {
      const startDate = new Date('2023-03-01');
      const endDate = new Date('2023-03-28');
      const query = {
        startDate,
        endDate,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };
      const start = DateUtil.setReset(startDate);
      const end = DateUtil.setReset(endDate, false);

      const queryCritia: FindManyOptions<FootballMatch> = {
        where: {
          startMatch: Between(start.toDate(), end.toDate()),
        },
        take: _paging.limit,
        skip: _paging.skip,
        select: {
          id: true,
          day: true,
          month: true,
          year: true,
          startMatch: true,
          scoreAway: true,
          scoreHome: true,
          homeTeam: {
            id: true,
            name: true,
          },
          awayTeam: {
            id: true,
            name: true,
          },
        },
        relations: {
          awayTeam: true,
          homeTeam: true,
        },
        order: {
          startMatch: 'ASC',
        },
      };
      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const size = 0;
      const docs = new Array(size)
        .fill(0)
        .map((_) => new FootballMatchSchedule());

      const expectedListMatchSchedule = {
        message: 'Get List Match Success',
        error: false,
        data: {
          docs: docs,
          paging: expect.any(Object),
        },
      };

      // mock function repositoty
      footBallMatchRepository.find = jest.fn().mockResolvedValueOnce(docs);
      footBallMatchRepository.count = jest.fn().mockResolvedValueOnce(size);

      const signalMatchArrangement = await controller.getMatch(_paging, {
        ...query,
        ..._paging,
      });

      expect(signalMatchArrangement).toEqual(expectedListMatchSchedule);
      expect(footBallMatchRepository.find).toHaveBeenCalledWith(queryCritia);
      expect(footBallMatchRepository.count).toHaveBeenCalledWith({
        where: queryCritia.where,
      });
    });
  });

  describe('Tournament (POST) Match Arrangement', () => {
    it('should Match Arrangement Exist Matchs', async () => {
      const match = {
        homeTeam: 80,
        awayTeam: 74,
        matchStartTime: '2023-03-15T03:11:30.748Z',
      };

      const payload = { match };
      const queryCriteriaFootballMatch = {
        where: {
          year: expect.any(Number),
          month: expect.any(Number),
          day: expect.any(Number),
        },
      };

      const footballMatchSchedule = new FootballMatchSchedule();
      footballMatchSchedule.id = 1;
      footballMatchSchedule.day = 23;
      footballMatchSchedule.month = 5;
      footballMatchSchedule.year = 20;

      footballMatchScheduleRepository.findOne = jest
        .fn()
        .mockResolvedValue(footballMatchSchedule);
      footballMatchScheduleRepository.save = jest
        .fn()
        .mockResolvedValue(footballMatchSchedule);

      const footballMatch = new FootballMatch();
      footballMatch.id = 1;
      footBallMatchRepository.findOne = jest
        .fn()
        .mockResolvedValue(footballMatch);
      footBallMatchRepository.save = jest.fn().mockResolvedValue(footballMatch);

      const resController = await controller.matchArrangementAsync(payload);

      const expectedListFootBallMatch = {
        message: 'Get Detail Success',
        data: footballMatch,
        error: false,
      };

      expect(resController).toEqual(expectedListFootBallMatch);
      expect(footballMatchScheduleRepository.findOne).toHaveBeenCalledWith(
        queryCriteriaFootballMatch,
      );
      expect(footBallMatchRepository.findOne).toBeCalled();
    });

    it('should Match Arrangement New Matchs', async () => {
      const match = {
        homeTeam: 80,
        awayTeam: 74,
        matchStartTime: '2023-03-15T03:11:30.748Z',
      };
      const payload = {
        match,
      };

      const queryCriteriaFootballMatch = {
        where: {
          year: expect.any(Number),
          month: expect.any(Number),
          day: expect.any(Number),
        },
      };

      const footballMatchSchedule = new FootballMatchSchedule();
      footballMatchSchedule.id = 1;
      footballMatchSchedule.day = 23;
      footballMatchSchedule.month = 5;
      footballMatchSchedule.year = 20;

      footballMatchScheduleRepository.findOne = jest
        .fn()
        .mockResolvedValue(null);
      footballMatchScheduleRepository.save = jest
        .fn()
        .mockResolvedValue(footballMatchSchedule);

      const footballMatch = new FootballMatch();
      footballMatch.id = 1;
      footBallMatchRepository.findOne = jest.fn().mockResolvedValue(null);
      footBallMatchRepository.save = jest.fn().mockResolvedValue(footballMatch);

      const resController = await controller.matchArrangementAsync(payload);

      const expectedListFootBallMatch = {
        message: expect.any(String),
        data: footballMatch,
        error: false,
      };

      expect(resController).toEqual(expectedListFootBallMatch);
      expect(footballMatchScheduleRepository.findOne).toHaveBeenCalledWith(
        queryCriteriaFootballMatch,
      );
      expect(footBallMatchRepository.findOne).toBeCalled();
    });

    it('should Match Arrangement Two New Matchs and One Exist Matchs', async () => {
      const match = {
        homeTeam: 80,
        awayTeam: 99,
        matchStartTime: '2023-03-25T03:12:17.420Z',
      };
      const payload = {
        match,
      };

      const queryCriteriaFootballMatch = {
        where: {
          year: expect.any(Number),
          month: expect.any(Number),
          day: expect.any(Number),
        },
      };

      const footballMatchSchedule = new FootballMatchSchedule();
      footballMatchSchedule.id = 1;
      footballMatchSchedule.day = 23;
      footballMatchSchedule.month = 5;
      footballMatchSchedule.year = 20;

      footballMatchScheduleRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(footballMatchSchedule)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(footballMatchSchedule);
      footballMatchScheduleRepository.save = jest
        .fn()
        .mockResolvedValue(footballMatchSchedule);

      const footballMatch = new FootballMatch();
      footballMatch.id = 1;
      footBallMatchRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(footballMatch)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      footBallMatchRepository.save = jest.fn().mockResolvedValue(footballMatch);

      const resController = await controller.matchArrangementAsync(payload);

      const expectedListFootBallMatch = {
        message: 'Get Detail Success',
        data: footballMatch,
        error: false,
      };

      expect(resController).toEqual(expectedListFootBallMatch);
      expect(footballMatchScheduleRepository.findOne).toHaveBeenCalledWith(
        queryCriteriaFootballMatch,
      );
      expect(footBallMatchRepository.findOne).toBeCalled();
    });
  });
});
