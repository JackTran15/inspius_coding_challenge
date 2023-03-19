import {
  FootBallMatchScheduleService,
  FootBallMatchService,
  FootballTeamService,
  ImageService,
  TournamentService,
} from '@/modules';
import { TournamentGetListResDto } from '@/modules/football-team-module/types';
import { Paging } from '@/shared/decorators';
import { PagingQueryDto } from '@/shared/dto';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FindManyOptions, In } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import {
  FootBallTeamRegisterTournamentDto,
  FootBallTeamRegisterTournamentParamDto,
  TournamentCreateDto,
  TournamentListCalendarQueryDto,
  TournamentListMatchQueryDto,
  TournamentListQueryDto,
  TournamentMatchArrangementDto,
} from '../dtos';
import { Tournament } from '@/entities';

@Controller('tournament')
export class TournamentController {
  constructor(
    private readonly _tournamentService: TournamentService,
    private readonly _imageService: ImageService,
    private readonly _footBallTeamService: FootballTeamService,
    private readonly _footBallMatchService: FootBallMatchService,
    private readonly _footBallMatchScheduleService: FootBallMatchScheduleService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get List Tournament Success',
    type: TournamentGetListResDto,
  })
  async getList(
    @Paging() paging: PagingQueryDto,
    @Query() query: TournamentListQueryDto,
  ): Promise<TournamentGetListResDto> {
    const queryCriteria: FindManyOptions<Tournament> = {
      relations: ['teams'],
      skip: paging.skip,
      take: paging.limit,
    };
    return await this._tournamentService.find(queryCriteria);
  }

  @Get('calendar')
  async getCalendar(
    @Paging() paging: PagingQueryDto,
    @Query() query: TournamentListCalendarQueryDto,
  ) {
    try {
      const { day, month, year } = query;
      const condition = {
        year,
      };
      if (month) {
        condition['month'] = month;
      }
      if (day) {
        condition['day'] = day;
      }

      const signalSchedules = await this._footBallMatchScheduleService.find({
        where: condition,
        select: ['id', 'year', 'month', 'day'],
        skip: paging.skip,
        take: paging.limit,
      });
      if (signalSchedules.error) throw new Error(signalSchedules.message);

      const schedules = signalSchedules.data.docs.map((schedule) => schedule);
      const schedulePaging = signalSchedules.data.paging;

      const countMatchInSchedules = [];
      for (const schedule of schedules) {
        const countMatchInSchedule = await this._footBallMatchService.count({
          where: { scheduleId: schedule.id },
        });

        countMatchInSchedules.push({
          ...schedule,
          countMatch: countMatchInSchedule,
        });
      }

      return {
        message: 'Get List Match Schedule',
        data: {
          docs: countMatchInSchedules,
          paging: schedulePaging,
        },
        error: false,
      };
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  @Get('match')
  async getMatch(
    @Paging() paging: PagingQueryDto,
    @Query() query: TournamentListMatchQueryDto,
  ) {
    const { day, month, year } = query;
    const condition = {
      year,
    };
    if (month) {
      condition['month'] = month;
    }
    if (day) {
      condition['day'] = day;
    }

    const signalSchedules = await this._footBallMatchScheduleService.find({
      where: condition,
      select: ['id', 'year', 'month', 'day'],
      skip: paging.skip,
      take: paging.limit,
    });
    if (signalSchedules.error) throw new Error(signalSchedules.message);

    const schedules = signalSchedules.data.docs;

    // use promise all

    const listPromise = schedules.map(async (schedule) => {
      const listMatch = await this._footBallMatchService.find({
        where: { scheduleId: schedule.id },
        relations: ['tournament', 'homeTeam', 'awayTeam', 'schedule'],
        order: {
          startMatch: 'DESC',
        },
        take: paging.limit,
        skip: paging.skip,
      });

      return {
        schedule,
        listMatch: listMatch?.data || [],
      };
    });

    const listMatch = await Promise.all(listPromise);
    return {
      message: 'Get List Match Schedule',
      data: {
        docs: listMatch,
        paging: signalSchedules.data.paging,
      },
      error: false,
    };
  }

  @Post('create')
  async createTournament(@Body() payload: TournamentCreateDto) {
    try {
      const signalTournament = await this._tournamentService.store(payload);
      return signalTournament;
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  @Post('match-arrangement')
  async matchArrangementAsync(@Body() payload: TournamentMatchArrangementDto) {
    try {
      const { tournamentId, matchs } = payload;
      const responseNewMatchs = [];
      const responseExistMatchs = [];
      for (const match of matchs) {
        const signalScheduleMatch =
          await this._footBallMatchScheduleService.getMatchScheduleOrCreated(
            match.matchStartTime,
          );

        const signalGetMatch = await this._footBallMatchService.findOne({
          where: {
            homeTeamId: match.homeTeam,
            awayTeamId: match.awayTeam,
            tournamentId: tournamentId,
            scheduleId: signalScheduleMatch.id,
          },
        });

        if (!signalGetMatch.error && signalGetMatch.data === null) {
          const signalMatch = await this._footBallMatchService.store({
            homeTeamId: match.homeTeam,
            awayTeamId: match.awayTeam,
            startMatch: match.matchStartTime,
            tournamentId: tournamentId,
            scheduleId: signalScheduleMatch.id,
          });
          responseNewMatchs.push(signalMatch.data);
        } else {
          responseExistMatchs.push(signalGetMatch.data);
        }
      }

      return {
        message: 'Match arrangement',
        data: {
          newMatchs: responseNewMatchs,
          existMatchs: responseExistMatchs,
        },
        error: false,
      };
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  @Put('id/:id')
  async updateTournamentById(
    @Param() params: FootBallTeamRegisterTournamentParamDto,
    @Body() payload: FootBallTeamRegisterTournamentDto,
  ) {
    try {
      const signalTournament = await this._tournamentService.findOne({
        where: {
          id: parseInt(params.id.toString()),
        },
        relations: ['teams'],
      });
      if (signalTournament.error || signalTournament.data === null) {
        throw new Error(signalTournament.message);
      }

      const tournament = signalTournament.data;

      const signalListFootBallTeam = await this._footBallTeamService.findByIds(
        payload.footBallTeamIds as EntityId[],
      );

      if (signalListFootBallTeam.error)
        throw new Error(signalListFootBallTeam.message);

      const listFootBallTeam = signalListFootBallTeam.data.docs;

      const signalUpdateTournament =
        await this._tournamentService.registerFootBallTeams(
          tournament,
          listFootBallTeam,
        );

      return signalUpdateTournament;
    } catch (e) {
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }

  @Get('seeding')
  async seedingAsync() {
    // Create 32 team
    const listTeam = [
      'MU',
      'MC',
      'PSG',
      'LFC',
      'RM',
      'BAR',
      'ATM',
      'JUV',
      'MIL',
      'INT',
      'LAZ',
      'ROM',
      'NAP',
      'SAS',
      'LAC',
      'LUD',
      'BAY',
      'DOR',
      'BVB',
      'SCH',
      'BRE',
      'WOL',
      'FIO',
      'SAMP',
      'GEN',
      'UDI',
      'CAG',
      'SPE',
      'TOR',
      'CRO',
      'SAS',
      'BOL',
    ];

    const listTeams = [];

    for (const team of listTeam) {
      const signalImage = await this._imageService.store({
        name: team,
        src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        alt: team,
      });
      if (signalImage.error) throw new Error("Can't create image");
      const image = signalImage.data;

      const signalFootBallTeam = await this._footBallTeamService.store({
        name: team,
        logoId: image.id,
      });
      listTeams.push(signalFootBallTeam.data);
    }

    // Create tournament
    const signalTournament = await this._tournamentService.store({
      name: 'Champions League',
      start: '2023-03-13T10:22:02.643Z',
      end: '2023-06-13T10:22:55.674Z',
      teams: listTeams,
    });

    const tournament = signalTournament.data;

    // schedule Match
    const payloadScheduleMatchs = [
      '2023-03-14T03:11:30.748Z',
      '2023-03-14T03:11:30.748Z',
      '2023-03-14T03:11:30.748Z',
      '2023-03-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-14T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-19T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-04-28T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-14T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-19T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-28T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-20T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-21T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
      '2023-05-01T03:11:30.748Z',
    ];

    for (const payloadScheduleMatch of payloadScheduleMatchs) {
      const signalScheduleMatch =
        await this._footBallMatchScheduleService.getMatchScheduleOrCreated(
          payloadScheduleMatch,
        );

      const homeTeam = listTeams[Math.floor(Math.random() * listTeams.length)];
      const awayTeam = listTeams[Math.floor(Math.random() * listTeams.length)];

      const signalGetMatch = await this._footBallMatchService.findOne({
        where: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          tournamentId: tournament.id,
          scheduleId: signalScheduleMatch.id,
        },
      });

      if (!signalGetMatch.error && signalGetMatch.data === null) {
        await this._footBallMatchService.store({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startMatch: payloadScheduleMatch,
          tournamentId: tournament.id,
          scheduleId: signalScheduleMatch.id,
        });
      }
    }
  }
}
