import { EntityRepository, Repository } from 'typeorm';
import { ImageEntity } from '../entities';

@EntityRepository(ImageEntity)
export class ImageRepository extends Repository<ImageEntity> {}
