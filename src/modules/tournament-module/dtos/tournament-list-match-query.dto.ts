import { PagingQueryDto } from '@/shared/dto/Paging';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class TournamentListMatchQueryDto extends PagingQueryDto {
  @ApiProperty({
    description: 'The query day in the calendar of the tournament',
    type: Number,
    minimum: 0,
    maximum: 31,
    required: false,
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
    required: false,
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
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  year?: number;
}
