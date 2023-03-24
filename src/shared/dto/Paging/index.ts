import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PagingQueryDto {
  @ApiProperty({
    description: 'Skip the first n elements',
    type: Number,
    minLength: 1,
    maxLength: 255,
    required: false,
    example: 0,
  })
  @IsNumberString()
  @IsOptional()
  skip: number;

  @ApiProperty({
    description: 'Limit the number of elements',
    type: Number,
    required: false,
    example: 30,
  })
  @IsNumberString()
  @IsOptional()
  limit: number;
}
