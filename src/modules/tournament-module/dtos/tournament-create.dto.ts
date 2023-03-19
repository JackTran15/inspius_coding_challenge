import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISO8601, IsNotEmpty } from 'class-validator';

export class TournamentCreateDto {
  @ApiProperty({
    description: 'The name of the tournament',
    type: String,
    minLength: 1,
    maxLength: 255,
    required: true,
    example: 'World Cup 2023',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The time name of the tournament',
    type: Date,
    required: true,
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  start: Date;

  @ApiProperty({
    description: 'The time end of the tournament',
    type: Date,
    required: true,
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  end: Date;

  constructor(partial: Partial<TournamentCreateDto>) {
    Object.assign(this, partial);
  }
}
