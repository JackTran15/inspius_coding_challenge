import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { _BaseEntity } from './base.entity';
import { FootballMatchSchedule } from './football-match-schedule.entity';
import { FootballTeam } from './football-team.entity';
import { Tournament } from './tournament.entity';

export enum EFootballMatchStatus {
  PENDING = 'pending',
  LIVE = 'live',
  FF = 'ff',
}
// FootballMatch N:1 Tournament
@Entity()
export class FootballMatch extends _BaseEntity {
  @Column({ name: 'tournament_id', type: 'int' })
  tournamentId: number;
  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ name: 'home_team_id', type: 'int' })
  homeTeamId: number;
  @JoinColumn({ name: 'home_team_id' })
  @ManyToOne(() => FootballTeam, (footballTeam) => footballTeam.id)
  homeTeam: FootballTeam;

  @Column({ name: 'away_team_id', type: 'int' })
  awayTeamId: number;
  @ManyToOne(() => FootballTeam, (footballTeam) => footballTeam.id)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: FootballTeam;

  @Column({ type: 'int', default: 0 })
  scoreHome: number;

  @Column({ type: 'int', default: 0 })
  scoreAway: number;

  @Column('datetime')
  startMatch: Date;

  @Column({
    type: 'enum',
    enum: EFootballMatchStatus,
    default: EFootballMatchStatus.PENDING,
  })
  status: EFootballMatchStatus;

  @Column({ name: 'schedule_id', type: 'int' })
  scheduleId: number;
  @ManyToOne(
    () => FootballMatchSchedule,
    (footballMatchSchedule) => footballMatchSchedule.id,
  )
  @JoinColumn({ name: 'schedule_id' })
  schedule: FootballMatchSchedule;
}