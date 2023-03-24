import { PagingQueryDto } from '@/shared/dto/Paging';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsISO8601,
  IsNumberString,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class ListCalendarQueryDto extends PagingQueryDto {
  @ApiProperty({
    description: 'The query start date in the calendar of the football match',
    type: Date,
    required: true,
    example: new Date(),
  })
  @IsISO8601()
  startDate: Date;

  @ApiProperty({
    description: 'The query end date in the calendar of the football match',
    type: Date,
    example: new Date(),
    required: true,
  })
  @IsISO8601()
  endDate: Date;
}
