import {
  FootBallMatchService,
  FootballTeamService,
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
import { DateUtil } from '@/shared/utils';

@Controller('tournament')
export class TournamentController {
  constructor(
    private readonly _tournamentService: TournamentService,
    private readonly _footBallTeamService: FootballTeamService,
    private readonly _footBallMatchService: FootBallMatchService,
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

      const schedules = await this._footBallMatchService.find({
        where: condition,
        take: paging.limit,
        skip: paging.skip,
        select: ['day', 'month', 'year'],
      });

      return {
        message: 'Get List Match Schedule',
        data: {
          docs: schedules.data.docs,
          paging: schedules.data.paging,
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

    const signalListMatch = await this._footBallMatchService.find({
      where: condition,
      take: paging.limit,
      skip: paging.skip,
      select: {
        id: true,
        day: true,
        month: true,
        year: true,
        startMatch: true,
        scoreAway: true,
        scoreHome: true,
        tournament: {
          id: true,
          name: true,
        },
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
        tournament: true,
        awayTeam: true,
        homeTeam: true,
      },
    });

    return {
      message: 'Get List Match Success',
      data: {
        docs: signalListMatch.data.docs,
        paging: signalListMatch.data.paging,
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
        const { dates, month, year }: any = DateUtil.get(match.matchStartTime, [
          'month',
          'year',
          'dates',
        ]);

        const signalGetMatch = await this._footBallMatchService.findOne({
          where: {
            homeTeamId: match.homeTeam,
            awayTeamId: match.awayTeam,
            tournamentId: tournamentId,
            day: dates,
            month,
            year,
          },
        });

        if (!signalGetMatch.error && signalGetMatch.data === null) {
          const signalMatch = await this._footBallMatchService.store({
            homeTeamId: match.homeTeam,
            awayTeamId: match.awayTeam,
            startMatch: match.matchStartTime,
            tournamentId: tournamentId,
            day: dates,
            month,
            year,
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
