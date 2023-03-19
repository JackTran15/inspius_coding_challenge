import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsNumberString,
  ValidateNested,
} from 'class-validator';

export class FootBallTeamRegisterTournamentDto {
  @ApiProperty({
    description: 'The id of the football teams',
    type: Array<number>,
    example: [1, 2, 3, 4, 5, 6, 7, 8],
  })
  @IsNumber({}, { each: true })
  footBallTeamIds!: Array<number>;
}
