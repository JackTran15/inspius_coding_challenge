import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FootballTeamService } from '@modules/football-team-module/services';
import {
  FootBallTeamCreateDto,
  FootBallTeamListQueryDto,
} from '@modules/football-team-module/dtos';
import { EFootballTeamStatus } from '@/entities';
import { Paging } from '@/shared/decorators';
import { PagingQueryDto } from '@/shared/dto/Paging';

@Controller('football-team')
export class FootBallTeamController {
  constructor(private readonly _footballTeamService: FootballTeamService) {}

  @Get()
  async getList(
    @Paging() paging: PagingQueryDto,
    @Query() query: FootBallTeamListQueryDto,
  ) {
    const optionsFind = {
      where: {
        status: EFootballTeamStatus.ACTIVE,
      },
      take: paging.limit,
      skip: paging.skip,
    };

    return await this._footballTeamService.find(optionsFind);
  }

  @Post('create')
  async createAsync(@Body() payload: FootBallTeamCreateDto) {
    const { name, logo } = payload;
    try {
      const signalFootBallTeam = await this._footballTeamService.store({
        name,
        logoName: logo.name,
        logoSrc: logo.src,
      });

      return signalFootBallTeam;
    } catch (error) {
      return {
        message: error.message,
        error: true,
        data: null,
      };
    }
  }
}
