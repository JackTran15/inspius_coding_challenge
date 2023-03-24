import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { _BaseEntity, FootballMatch, FootballTeam } from '@/entities';

@Entity()
export class Tournament extends _BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'timestamp' })
  start: Date;

  @Column({ type: 'timestamp' })
  end: Date;

  @ManyToMany(() => FootballTeam)
  @JoinTable()
  teams: FootballTeam[];
}
