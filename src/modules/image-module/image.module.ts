import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../../entities';
import { ImageService } from './services/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImageService],
  exports: [TypeOrmModule, ImageService],
})
export class ImageModule {}
