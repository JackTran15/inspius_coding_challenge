import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { _BaseEntity, FootballMatch, FootballTeam } from '@/entities';

@Entity()
export class Tournament extends _BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'timestamp' })
  start: Date;

  @ManyToMany(() => FootballTeam)
  @JoinTable()
  teams: FootballTeam[];

  @ManyToOne(() => FootballMatch, (match) => match.tournament)
  matches: FootballMatch[];
}
