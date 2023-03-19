import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsISO8601,
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
    description: 'The id of the tournament',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  tournamentId!: number;

  @ApiProperty({
    description: 'The match arrangement of the tournament',
    type: Array<TournamentMatchArrangementItemDto>,
    example: [
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
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  matchs: Array<TournamentMatchArrangementItemDto>;
}
