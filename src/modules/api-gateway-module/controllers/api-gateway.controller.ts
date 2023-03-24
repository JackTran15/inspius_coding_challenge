import { FootballMatchSchedule } from '@/entities';
import { FootBallMatchService, FootballTeamService } from '@/modules';
import { FootBallMatchScheduleService } from '@/modules/football-match-schedule-module/services';
import { Paging } from '@/shared/decorators';
import { PagingQueryDto } from '@/shared/dto';
import { DateUtil } from '@/shared/utils';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Between, FindManyOptions } from 'typeorm';
import {
  ListCalendarQueryDto,
  ListMatchQueryDto,
  TournamentMatchArrangementDto,
} from '../dtos';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly _footBallMatchService: FootBallMatchService,
    private readonly _footBallMatchSchuleService: FootBallMatchScheduleService,
  ) {}

  @Get('calendar')
  async getCalendar(
    @Paging() paging: PagingQueryDto,
    @Query() query: ListCalendarQueryDto,
  ) {
    try {
      const { startDate, endDate } = query;
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
      /**
       * Find schedule in query criteria with condition day, month, year
       * Distinct select raw with colurms(day, month, year).
       */
      const schedules = await this._footBallMatchSchuleService.find(
        queryCritia,
      );

      return schedules;
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
    @Query() query: ListMatchQueryDto,
  ) {
    const { startDate, endDate } = query;

    const start = DateUtil.setReset(startDate);
    const end = DateUtil.setReset(endDate, false);

    // get information match in condition day, month, year
    // select and relation
    const signalListMatch = await this._footBallMatchService.find({
      where: {
        startMatch: Between(start.toDate(), end.toDate()),
      },
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
    });

    return {
      message: 'Get List Match Success',
      data: {
        docs: signalListMatch.data.docs,
        paging: signalListMatch.data.paging,
      },
      error: signalListMatch.error,
    };
  }

  @Post('match-arrangement')
  // @UseGuards(ApiKeyGuard)
  async matchArrangementAsync(@Body() payload: TournamentMatchArrangementDto) {
    try {
      const { match } = payload;

      const signalGetSchedule =
        await this._footBallMatchSchuleService.getMatchScheduleOrCreated(
          match.matchStartTime,
        );

      /**
       * Find footBall Match is exist
       * if exist true add match to responseExistMatchs
       * else create match after add to responseNewMatchs
       */
      const signalGetMatch = await this._footBallMatchService.findOne({
        where: {
          homeTeamId: match.homeTeam,
          awayTeamId: match.awayTeam,
          scheduleId: signalGetSchedule.data.id,
          day: signalGetSchedule.data.day,
          month: signalGetSchedule.data.month,
          year: signalGetSchedule.data.year,
        },
      });

      if (!signalGetMatch.error && signalGetMatch.data === null) {
        const signalMatch = await this._footBallMatchService.store({
          homeTeamId: match.homeTeam,
          awayTeamId: match.awayTeam,
          startMatch: match.matchStartTime,
          scheduleId: signalGetSchedule.data.id,
          day: signalGetSchedule.data.day,
          month: signalGetSchedule.data.month,
          year: signalGetSchedule.data.year,
        });
        return signalMatch;
      } else {
        return signalGetMatch;
      }
    } catch (e) {
      console.log('e', e);
      return {
        message: e.message,
        data: null,
        error: true,
      };
    }
  }
}
