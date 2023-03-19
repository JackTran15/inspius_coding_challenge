import { _BaseEntity } from './base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class ImageEntity extends _BaseEntity {
  @Column('text')
  name: string;
  @Column('text')
  src: string;
  @Column('text')
  alt: string;
}
