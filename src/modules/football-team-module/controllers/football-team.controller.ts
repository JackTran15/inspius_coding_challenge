import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FootballTeamService } from '@modules/football-team-module/services';
import {
  FootBallTeamCreateDto,
  FootBallTeamListQueryDto,
} from '@modules/football-team-module/dtos';
import { EFootballTeamStatus } from '@/entities';
import { Paging } from '@/shared/decorators';
import { PagingQueryDto } from '@/shared/dto/Paging';
import { ApiKeyGuard } from '@/modules/api-key-module/guards/api-key.guard';

@Controller('football-team')
export class FootBallTeamController {
  constructor(private readonly _footballTeamService: FootballTeamService) {}

  @Get()
  // @UseGuards(ApiKeyGuard)
  async getList(
    @Paging() paging: PagingQueryDto,
    @Query() query: FootBallTeamListQueryDto,
  ) {
    // condition query with status code FootBallTeam is Active and paging skip, limit
    const queryCriteria = {
      where: {
        status: EFootballTeamStatus.ACTIVE,
      },
      take: paging.limit,
      skip: paging.skip,
    };

    return await this._footballTeamService.find(queryCriteria);
  }

  @Post('create')
  // @UseGuards(ApiKeyGuard)
  async createAsync(@Body() payload: FootBallTeamCreateDto) {
    const { name, logo } = payload;
    try {
      // insert new food ball team
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
