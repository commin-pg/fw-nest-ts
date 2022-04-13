import { IsEnum } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FinanceType } from '../finance.service';
import { FinanceCandidate } from './finance_candidate.entity';

export enum SutableType {
  SUTABLE = 'SUTABLE',
  CASH_LESS = 'CASH_LESS',
  DEPT_LESS = 'DEPT_LESS',
  SHARE_LESS = 'SHARE_LESS',
  PER_LESS = 'PER_LESS',
  PBR_LESS = 'PBR_LESS',
  PSR_LESS = 'PSR_LESS',
  PROFIT_LESS = 'PROFIT_LESS',
  OTHER = 'OTHER',
  UNSUTABLE = 'UNSUTABLE'
}

@Entity()
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  regDate: string;
  @Column({ type: 'varchar', nullable: false, primary: true })
  dateKey: string;
  @Column({ type: 'varchar', nullable: false, primary: true })
  compayName: string;

  @Column({ type: 'int' })
  public rank: number;

  @Column({ type: 'varchar' })
  compayFinanceDetailUrl: string;

  @Column({ type: 'decimal', nullable: false })
  currentFinancePrice: number;
  @Column({ type: 'decimal', nullable: false })
  facePrice: number;
  @Column({ type: 'decimal', nullable: false })
  tradeAmount: number;
  @Column({ type: 'decimal', nullable: false })
  sharesNumber: number;
  @Column({ type: 'decimal', nullable: false })
  totalMarketCap: number;
  @Column({ type: 'decimal', nullable: false })
  perRate: number;
  @Column({ type: 'decimal', nullable: false })
  pbrRate: number;

  @Column({ type: 'decimal', nullable: false, array: true })
  yearSales: number[];
  @Column({ type: 'decimal', nullable: false, array: true })
  currentQuarterSales: number[];

  @Column({ type: 'decimal', nullable: false })
  saleProfitRate: number;
  @Column({ type: 'decimal', nullable: false })
  salePureProfitRate: number;
  @Column({ type: 'decimal', nullable: false })
  deptRate: number;
  @Column({ type: 'decimal', nullable: false })
  psrRate: number;
  @Column({ type: 'decimal', nullable: false })
  cashRate: number;

  @IsEnum(SutableType)
  @Column({
    type: 'text',
    // enum: SutableType,
    default: SutableType.SUTABLE,
    nullable: false,
  })
  sutableType: SutableType;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  financeType: string;


  @ManyToOne((type) => User, (user) => user.finances, { eager: true })
  user: User;
}
