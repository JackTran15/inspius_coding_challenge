import { Column, Entity, ManyToMany } from 'typeorm';
import { _BaseEntity } from './base.entity';
import { Tournament } from './tournament.entity';

export enum EFootballTeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class FootballTeam extends _BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column('text')
  logoName: string;

  @Column('text')
  logoSrc: string;

  @Column({
    type: 'enum',
    enum: EFootballTeamStatus,
    default: EFootballTeamStatus.ACTIVE,
  })
  status: EFootballTeamStatus;
}
