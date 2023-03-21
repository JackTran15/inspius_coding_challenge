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
      });

      return {
        schedule,
        listMatch: listMatch?.data.docs || [],
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
}
