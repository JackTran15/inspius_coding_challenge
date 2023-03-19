import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FootballTeamService } from '@modules/football-team-module/services';
import { ImageService } from '@modules/image-module/services';
import {
  FootBallTeamCreateDto,
  FootBallTeamListQueryDto,
} from '@modules/football-team-module/dtos';
import { EFootballTeamStatus } from '@/entities';
import { Paging } from '@/shared/decorators';
import { PagingQueryDto } from '@/shared/dto/Paging';
import { EntityManager } from 'typeorm';

@Controller('football-team')
export class FootBallTeamController {
  constructor(
    private readonly _footballTeamService: FootballTeamService,
    private readonly _imageService: ImageService,
    private readonly _entityManager: EntityManager,
  ) {}

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
      relations: ['logo'],
    };

    return await this._footballTeamService.find(optionsFind);
  }

  @Post('create')
  async createAsync(@Body() payload: FootBallTeamCreateDto) {
    const { name, logo } = payload;

    return this._entityManager.transaction(async () => {
      try {
        const signalImage = await this._imageService.store(logo);
        if (signalImage.error) throw new Error("Can't create image");
        const image = signalImage.data;

        const signalFootBallTeam = await this._footballTeamService.store({
          name,
          logoId: image.id,
        });

        return signalFootBallTeam;
      } catch (error) {
        return {
          message: error.message,
          error: true,
          data: null,
        };
      }
    });
  }
}
