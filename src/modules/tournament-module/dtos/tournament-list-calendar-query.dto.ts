import { PagingQueryDto } from '@/shared/dto/Paging';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, Max, Min } from 'class-validator';

export class TournamentListCalendarQueryDto extends PagingQueryDto {
  @ApiProperty({
    description: 'The query day in the calendar of the tournament',
    type: Number,
    minimum: 0,
    maximum: 31,
    required: true,
    example: 0,
  })
  @IsNumberString()
  @IsOptional()
  day?: number;

  @ApiProperty({
    description: 'The query month in the calendar of the tournament',
    type: Number,
    minimum: 1,
    maximum: 12,
    example: 1,
  })
  @IsNumberString()
  @IsOptional()
  month?: number;

  @ApiProperty({
    description: 'The query year in the calendar of the tournament',
    type: Number,
    minimum: 1975,
    maximum: 2100,
    example: 2023,
  })
  @IsNumberString()
  @IsOptional()
  year?: number;
}
