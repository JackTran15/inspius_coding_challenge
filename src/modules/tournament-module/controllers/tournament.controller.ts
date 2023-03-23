import {
  FootBallMatchService,
  FootballTeamService,
  TournamentService,
} from '@/modules';
import { TournamentGetListResDto } from '@/modules/football-team-module/types';
import { Paging } from '@/shared/decorators';
import { PagingQueryDto } from '@/shared/dto';
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { ApiKeyGuard } from '@/modules/api-key-module/guards/api-key.guard';

@Controller('tournament')
export class TournamentController {
  constructor(
    private readonly _tournamentService: TournamentService,
    private readonly _footBallTeamService: FootballTeamService,
    private readonly _footBallMatchService: FootBallMatchService,
  ) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Get List Tournament Success',
    type: TournamentGetListResDto,
  })
  async getList(
    @Paging() paging: PagingQueryDto,
    @Query() query: TournamentListQueryDto,
  ): Promise<TournamentGetListResDto> {
    // relation model footballteam when find tournament
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

      /**
       * Find schedule in query criteria with condition day, month, year 
       * Distinct select raw with colurms(day, month, year).
       */
      const schedules = await this._footBallMatchService.findDistinctCalendar({
        where: condition,
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

    // get information match in condition day, month, year
    // select and relation
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
  @UseGuards(ApiKeyGuard)
  async createTournament(@Body() payload: TournamentCreateDto) {
    try {
      // insert tournament
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
  @UseGuards(ApiKeyGuard)
  async matchArrangementAsync(@Body() payload: TournamentMatchArrangementDto) {
    try {
      const { tournamentId, matchs } = payload;
      const responseNewMatchs = []; // return create new match success
      const responseExistMatchs = []; // return exist match, can you notify manager create match arrangement

      for (const match of matchs) {
        // get dates, month year from matchStartTime
        const { dates, month, year }: any = DateUtil.get(match.matchStartTime, [
          'month',
          'year',
          'dates',
        ]);

        /**
         * Find footBall Match is exist
         * if exist true add match to responseExistMatchs
         * else create match after add to responseNewMatchs
         */
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
  @UseGuards(ApiKeyGuard)
  async updateTournamentById(
    @Param() params: FootBallTeamRegisterTournamentParamDto,
    @Body() payload: FootBallTeamRegisterTournamentDto,
  ) {
    try {
      // check tournament exist when update register football in tournament
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

      // get list football team register tournament
      const signalListFootBallTeam = await this._footBallTeamService.findByIds(
        payload.footBallTeamIds as EntityId[],
      );

      if (signalListFootBallTeam.error)
        throw new Error(signalListFootBallTeam.message);

      const listFootBallTeam = signalListFootBallTeam.data.docs;

      // add new list foot ball team to list teams in entity tournament after update tournament with new list teams
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
