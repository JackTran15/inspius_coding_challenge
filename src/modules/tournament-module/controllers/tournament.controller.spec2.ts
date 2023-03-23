import { FootBallMatchService } from '@/modules/football-match-module';
import { FootballTeamService } from '@/modules/football-team-module';
import { Test, TestingModule } from '@nestjs/testing';
import { In } from 'typeorm';
import { TournamentService } from '../services';
import { TournamentController } from './tournament.controller';

describe('FootBallTeamController', () => {
  let controller: TournamentController;
  let tournamentService: TournamentService;
  let footBalLTeamService: FootballTeamService;
  let footBallMatchService: FootBallMatchService;
  const paging = {
    limit: 10,
    skip: 0,
  };

  const mockFuncDefault = () => ({
    find: jest.fn((options) => {
      return {
        message: 'success',
        data: [],
        error: false,
      };
    }),
  });

  beforeEach(async () => {
    const TournamentProvider = {
      provide: TournamentService,
      useFactory: mockFuncDefault,
    };

    const FootballTeamProvider = {
      provide: FootballTeamService,
      useFactory: mockFuncDefault,
    };

    const FootBallMatchProvider = {
      provide: FootBallMatchService,
      useFactory: mockFuncDefault,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [TournamentController],
      providers: [
        TournamentService,
        TournamentProvider,
        FootballTeamProvider,
        FootBallMatchProvider,
      ],
    }).compile();

    controller = module.get<TournamentController>(TournamentController);
    tournamentService = module.get<TournamentService>(TournamentService);
    footBalLTeamService = module.get<FootballTeamService>(FootballTeamService);
    footBallMatchService =
      module.get<FootBallMatchService>(FootBallMatchService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should all service be defined', () => {
    expect(tournamentService).toBeDefined();
    expect(footBalLTeamService).toBeDefined();
    expect(footBallMatchService).toBeDefined();
  });

  describe('Tournament (GET) Get List Tournament', () => {
    it('should return list data of tournament', async () => {
      const _paging = {
        limit: 10,
        skip: 0,
      };

      const expectedListTournament = {
        error: false,
        data: {
          docs: expect.any(Array),
          paging: expect.any(Object),
        },
        message: 'Get List Success',
      };
      // overide result function find in tournamentService
      const queryCriteria = {
        relations: ['teams'],
        skip: _paging.skip,
        take: _paging.limit,
      };
      tournamentService.find = jest
        .fn()
        .mockResolvedValue(expectedListTournament);

      const result = await controller.getList(_paging, _paging);

      const signalFootBallTeam = await tournamentService.find(queryCriteria);
      expect(tournamentService.find).toBeCalledWith(queryCriteria);
      expect(result).toEqual(signalFootBallTeam);
    });

    it('should return list empty data of tournament', async () => {
      const result = await controller.getList(paging, paging);
      const expectedListTournament = {
        message: 'success',
        data: [],
        error: false,
      };
      // overide result function find in tournamentService
      tournamentService.find = jest
        .fn()
        .mockResolvedValue(expectedListTournament);

      expect(result).toEqual(expectedListTournament);
    });
  });

  describe('Tournament (GET) Get List Tournament Calendar', () => {
    it('should return list data Calendar of tournament', async () => {
      const query = {
        day: 23,
        month: 2,
        year: 2023,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };

      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const queryCriteriaFootBallMatchSchedule = {
        where: {
          ...query,
        },
        select: ['id', 'year', 'month', 'day'],
        skip: paging.skip,
        take: paging.limit,
      };

      const listSchedule = [
        {
          id: 1,
          year: 2023,
          month: 2,
          day: 23,
        },
        {
          id: 2,
          year: 2023,
          month: 2,
          day: 25,
        },
      ];

      const sizeSchedule = listSchedule.length;
      const signalFootBallTeamSchedule = {
        error: false,
        data: {
          docs: listSchedule,
          paging: {
            total: sizeSchedule,
            limit: _paging.limit,
            skip:
              sizeSchedule > _paging.skip + _paging.limit
                ? _paging.skip + _paging.limit
                : _paging.skip + sizeSchedule,
          },
        },
      };

      // Mock data footBallMatch
      const countMatchs = [2, 1];

      footBallMatchService.count = jest
        .fn()
        .mockResolvedValueOnce(countMatchs[0])
        .mockResolvedValueOnce(countMatchs[1]);

      const footBallTeamScheduleDate = signalFootBallTeamSchedule.data;
      const expectedListMatchSchedule = {
        error: false,
        data: {
          docs: footBallTeamScheduleDate.docs.map((item, index) => ({
            ...item,
            countMatch: countMatchs[index],
          })),
          paging: footBallTeamScheduleDate.paging,
        },
        message: expect.any(String),
      };

      const resListMatchSchedule = await controller.getCalendar(_paging, {
        ...query,
        ...paging,
      });

      expect(resListMatchSchedule).toEqual(expectedListMatchSchedule);

      expect(footBallMatchService.count).toBeCalledWith({
        where: {
          scheduleId: listSchedule[0].id,
        },
      });
      expect(footBallMatchService.count).toBeCalledWith({
        where: {
          scheduleId: listSchedule[1].id,
        },
      });
    });

    it('should return dont find schedule in query', async () => {
      const query = {
        day: 23,
        month: 2,
        year: 2023,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };

      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const queryCriteriaFootBallMatchSchedule = {
        where: {
          ...query,
        },
        select: ['id', 'year', 'month', 'day'],
        skip: paging.skip,
        take: paging.limit,
      };

      const listSchedule = [];

      const sizeSchedule = listSchedule.length;
      const signalFootBallTeamSchedule = {
        error: false,
        data: {
          docs: listSchedule,
          paging: {
            total: sizeSchedule,
            limit: _paging.limit,
            skip:
              _paging.skip + _paging.limit > sizeSchedule
                ? sizeSchedule
                : _paging.skip + _paging.limit,
          },
        },
      };

      // Mock data footBallMatch
      const countMatchs = [2, 1];

      footBallMatchService.count = jest
        .fn()
        .mockResolvedValueOnce(countMatchs[0])
        .mockResolvedValueOnce(countMatchs[1]);

      const footBallTeamScheduleDate = signalFootBallTeamSchedule.data;
      const expectedListMatchSchedule = {
        error: false,
        data: {
          docs: footBallTeamScheduleDate.docs.map((item, index) => ({
            ...item,
            countMatch: countMatchs[index],
          })),
          paging: footBallTeamScheduleDate.paging,
        },
        message: expect.any(String),
      };

      const resListMatchSchedule = await controller.getCalendar(_paging, {
        ...query,
        ...paging,
      });

      expect(resListMatchSchedule).toEqual(expectedListMatchSchedule);

      expect(footBallMatchService.count).not.toBeCalled();
    });
  });

  describe('Tournament (GET) Get List Tournament Match', () => {
    it('should return list data Football Math of tournament', async () => {
      const query = {
        day: 23,
        month: 2,
        year: 2023,
      };
      const _paging = {
        limit: 10,
        skip: 0,
      };

      // Return data Schedule of tournament by query criteria (day, month, year)
      // Success case
      const queryCriteriaFootBallMatchSchedule = {
        where: {
          ...query,
        },
        select: ['id', 'year', 'month', 'day'],
        take: _paging.limit,
        skip: _paging.skip,
      };

      const listSchedule = [
        {
          id: 1,
          year: 2023,
          month: 2,
          day: 23,
        },
        {
          id: 2,
          year: 2023,
          month: 2,
          day: 25,
        },
      ];

      const sizeSchedule = listSchedule.length;
      const signalFootBallTeamSchedule = {
        error: false,
        data: {
          docs: listSchedule,
          paging: {
            total: sizeSchedule,
            limit: _paging.limit,
            skip:
              sizeSchedule > _paging.skip + _paging.limit
                ? _paging.skip + _paging.limit
                : _paging.skip + sizeSchedule,
          },
        },
      };

      // Mock data footBallMatch
      const queryCriteriaFootBallMatch = {
        where: {
          scheduleId: In(listSchedule.map((schedule) => schedule.id)),
        },
        relations: ['tournament', 'homeTeam', 'awayTeam', 'schedule'],
        order: {
          startMatch: 'DESC',
        },
        skip: _paging.skip,
        take: _paging.limit,
      };

      const expectedFootballMatchInSchedules = {
        error: false,
        data: {
          docs: expect.any(Array),
          paging: expect.any(Object),
        },
        message: expect.any(String),
      };

      footBallMatchService.find = jest
        .fn()
        .mockResolvedValueOnce(expectedFootballMatchInSchedules);

      const expectedListMatchSchedule = expectedFootballMatchInSchedules;

      const resListMatchSchedule = await controller.getMatch(_paging, {
        ...query,
        ...paging,
      });

      expect(resListMatchSchedule).toEqual(expectedListMatchSchedule);
    });
  });

  describe('Tournament (POST) Create Tournament', () => {
    it('should create tournament success', async () => {
      const tournamentPayload = {
        name: 1,
        start: 'ádasjd',
        end: 'ámdasd',
      };
      const expectedCreateTournament = {
        error: false,
        data: expect.any(Object),
        message: expect.any(String),
      };

      tournamentService.store = jest
        .fn()
        .mockResolvedValueOnce(expectedCreateTournament);

      const resCreateTournament = await controller.createTournament(
        tournamentPayload as any,
      );

      expect(resCreateTournament).toEqual(expectedCreateTournament);
      expect(tournamentService.store).toBeCalledWith(tournamentPayload);
    });

    it('should do not create tounament', async () => {
      const tournamentPayload = {
        name: 1,
        start: 'ádasjd',
        end: 'ámdasd',
      };
      const expectedCreateTournament = {
        error: true,
        data: expect.any(Object),
        message: expect.any(String),
      };
      tournamentService.store = jest
        .fn()
        .mockRejectedValueOnce(expectedCreateTournament);

      const resCreateTournament = await controller.createTournament(
        tournamentPayload as any,
      );

      expect(resCreateTournament).toEqual(expectedCreateTournament);
      expect(tournamentService.store).toBeCalledWith(tournamentPayload);
    });
  });

  describe('Tournament (PUT) Update Tournament Register List Football Team Join The Tournament', () => {
    it('should update tournament success', async () => {
      const tournamentId = 1;
      const payload = {
        footBallTeamIds: [1, 3],
      };

      const queryCriteriaTournament = {
        where: {
          id: parseInt(tournamentId.toString()),
        },
        relations: ['teams'],
      };

      const signalTournament = {
        error: false,
        data: expect.any(Object),
        message: expect.any(String),
      };
      tournamentService.findOne = jest
        .fn()
        .mockResolvedValueOnce(signalTournament);

      const queryCriteriaFootBallTeam = payload.footBallTeamIds;
      const signalFootBallTeams = {
        error: false,
        data: {
          docs: expect.any(Array),
          paging: expect.any(Object),
        },
        message: expect.any(String),
      };

      footBalLTeamService.findByIds = jest
        .fn()
        .mockResolvedValueOnce(signalFootBallTeams);

      tournamentService.registerFootBallTeams = jest
        .fn()
        .mockResolvedValueOnce(signalTournament);

      const expectedUpdateTournament = {
        error: false,
        data: expect.any(Object),
        message: expect.any(String),
      };

      const signalUpdateTournament = await controller.updateTournamentById(
        { id: tournamentId },
        payload as any,
      );

      expect(signalUpdateTournament).toEqual(expectedUpdateTournament);
      expect(tournamentService.findOne).toBeCalledWith(queryCriteriaTournament);
      expect(footBalLTeamService.findByIds).toBeCalledWith(
        queryCriteriaFootBallTeam,
      );
    });
    it('should do not update tournament exist ', async () => {
      const tournamentId = 1;
      const payload = {
        footBallTeamIds: [1, 3],
      };

      const queryCriteriaTournament = {
        where: {
          id: parseInt(tournamentId.toString()),
        },
        relations: ['teams'],
      };
      const signalTournament = new Error('Dont find tournament');
      tournamentService.findOne = jest
        .fn()
        .mockRejectedValueOnce(signalTournament);

      const signalFootBallTeams = {
        error: false,
        data: {
          docs: expect.any(Array),
          paging: expect.any(Object),
        },
        message: expect.any(String),
      };

      footBalLTeamService.findByIds = jest
        .fn()
        .mockResolvedValueOnce(signalFootBallTeams);

      const expectedUpdateTournament = {
        error: true,
        data: expect.any(Object),
        message: expect.any(String),
      };

      const signalUpdateTournament = await controller.updateTournamentById(
        { id: tournamentId },
        payload as any,
      );

      expect(signalUpdateTournament).toEqual(expectedUpdateTournament);
      expect(tournamentService.findOne).toBeCalledWith(queryCriteriaTournament);
      expect(footBalLTeamService.findByIds).not.toBeCalled();
    });

    it('should do not update tournament footBallTeams exist ', async () => {
      const tournamentId = 1;
      const payload = {
        footBallTeamIds: [1, 3],
      };

      const queryCriteriaTournament = {
        where: {
          id: parseInt(tournamentId.toString()),
        },
        relations: ['teams'],
      };
      const signalTournament = {
        error: false,
        data: expect.any(Object),
        message: expect.any(String),
      };
      tournamentService.findOne = jest
        .fn()
        .mockResolvedValueOnce(signalTournament);

      const queryCriteriaFootBallTeam = payload.footBallTeamIds;

      const signalFootBallTeams = new Error('Dont find footBallTeams');
      footBalLTeamService.findByIds = jest
        .fn()
        .mockRejectedValueOnce(signalFootBallTeams);

      const expectedUpdateTournament = {
        error: true,
        data: expect.any(Object),
        message: signalFootBallTeams.message,
      };

      const signalUpdateTournament = await controller.updateTournamentById(
        { id: tournamentId },
        payload as any,
      );

      expect(signalUpdateTournament).toEqual(expectedUpdateTournament);
      expect(tournamentService.findOne).toBeCalledWith(queryCriteriaTournament);
      expect(footBalLTeamService.findByIds).toBeCalledWith(
        queryCriteriaFootBallTeam,
      );
    });
  });

  describe('Tournament (POST) Match Arrangement', () => {
    it('should Match Arrangement New Matchs and Exist Matchs', async () => {
      const tournamentId = 1;
      const matchs = [
        {
          homeTeam: 80,
          awayTeam: 74,
          matchStartTime: '2023-03-15T03:11:30.748Z',
        },
        {
          homeTeam: 80,
          awayTeam: 74,
          matchStartTime: '2023-03-15T03:11:30.748Z',
        },
        {
          homeTeam: 80,
          awayTeam: 99,
          matchStartTime: '2023-03-25T03:12:17.420Z',
        },
      ];
      const payload = {
        tournamentId,
        matchs,
      };

      const scheduleFind = {
        id: 1,
      };

      const countFindMatchSuccess = 2;

      const signalFindMatchSuccess = {
        error: false,
        data: expect.any(Object),
        message: expect.any(String),
      };

      const signalFindMatchFail = {
        error: false,
        data: null,
        message: expect.any(String),
      };
      footBallMatchService.findOne = jest
        .fn()
        .mockResolvedValueOnce(signalFindMatchSuccess)
        .mockResolvedValueOnce(signalFindMatchFail)
        .mockResolvedValueOnce(signalFindMatchFail);

      footBallMatchService.store = jest
        .fn()
        .mockResolvedValueOnce(signalFindMatchSuccess)
        .mockResolvedValueOnce(signalFindMatchSuccess);
      const expectedMatchArrangement = {
        error: false,
        data: {
          newMatchs: expect.any(Array),
          existMatchs: expect.any(Array),
        },
        message: expect.any(String),
      };

      const signalMatchArrangement = await controller.matchArrangementAsync(
        payload,
      );

      expect(signalMatchArrangement).toEqual(expectedMatchArrangement);
      expect(footBallMatchService.findOne).toBeCalledTimes(matchs.length);
      expect(footBallMatchService.store).toBeCalledTimes(countFindMatchSuccess);
    });
  });
});
