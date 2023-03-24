import { Column, Entity } from 'typeorm';
import { _BaseEntity } from './base.entity';

@Entity()
export class FootballMatchSchedule extends _BaseEntity {
  @Column({ type: 'int' })
  day: number;
  @Column({ type: 'int' })
  month: number;
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'datetime' })
  dateValue: Date;
}
