import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { _BaseEntity } from './base.entity';
import { ImageEntity } from './image.entity';
import { Tournament } from './tournament.entity';

export enum EFootballTeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class FootballTeam extends _BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'logo_id', type: 'int' })
  logoId: number;
  @OneToOne(() => ImageEntity, { eager: true })
  @JoinColumn({ name: 'logo_id' })
  logo: ImageEntity;

  @Column({
    type: 'enum',
    enum: EFootballTeamStatus,
    default: EFootballTeamStatus.ACTIVE,
  })
  status: EFootballTeamStatus;

  @ManyToMany(() => Tournament, (tournament) => tournament.teams)
  tournaments: Tournament;
}
