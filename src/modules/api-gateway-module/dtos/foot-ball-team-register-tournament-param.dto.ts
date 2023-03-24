import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsNumberString } from 'class-validator';

export class FootBallTeamRegisterTournamentParamDto {
  @ApiProperty({
    description: 'The id of the tournament',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumberString()
  id!: number;
}
