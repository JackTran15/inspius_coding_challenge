import { Injectable } from '@nestjs/common';
import { ImageEntity } from '../../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../shared/services/base-service/base.service';
import { ImageRepository } from '../../../repositories/image.repository';

@Injectable()
export class ImageService extends BaseService<ImageEntity> {
  constructor(
    @InjectRepository(ImageEntity)
    _imageRepository: ImageRepository,
  ) {
    super(_imageRepository);
  }
}
