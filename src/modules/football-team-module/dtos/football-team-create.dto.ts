import { ImageCreateDto } from '@/shared/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  Length,
  ValidateNested,
} from 'class-validator';

export class FootBallTeamCreateDto {
  @ApiProperty({
    description: 'The name of the football team',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'The Logo of the football team',
    type: ImageCreateDto,
    minLength: 1,
    maxLength: 255,
  })
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ImageCreateDto)
  logo: ImageCreateDto;

  constructor(partial: Partial<FootBallTeamCreateDto>) {
    Object.assign(this, partial);
  }
}
