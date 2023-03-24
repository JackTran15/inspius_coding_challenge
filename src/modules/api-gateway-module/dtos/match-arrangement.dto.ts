import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsISO8601,
  IsObject,
  IsNotEmptyObject,
  IsDefined,
} from 'class-validator';

export class TournamentMatchArrangementItemDto {
  @ApiProperty({
    description: 'The id of the football team',
    type: Number,
    example: 1,
  })
  @IsNumber()
  homeTeam: number;

  @ApiProperty({
    description: 'The id of the football team',
    type: Number,
    example: 2,
  })
  @IsNumber()
  awayTeam: number;

  @ApiProperty({
    description: 'The time of the match start',
    type: String,
    example: '2021-01-01 00:00:00',
  })
  @IsISO8601()
  matchStartTime: string;
}

export class TournamentMatchArrangementDto {
  @ApiProperty({
    description: 'The match arrangement of the tournament',
    type: TournamentMatchArrangementItemDto,
    example: {
      homeTeam: 80,
      awayTeam: 99,
      matchStartTime: '2023-03-25T03:12:17.420Z',
    },
  })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TournamentMatchArrangementItemDto)
  match: TournamentMatchArrangementItemDto;
}
