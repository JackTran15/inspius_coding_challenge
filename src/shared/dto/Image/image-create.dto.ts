import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImageCreateDto {
  @ApiProperty({
    description: 'The name of the image',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The src of the image',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  src: string;

  @ApiProperty({
    description: 'The alt of the image',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  alt: string;
}
