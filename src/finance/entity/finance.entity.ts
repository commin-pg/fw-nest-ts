import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FinanceType } from '../finance.service';

// case "CASH_LESS":
// 						cashlessModelList.add(model_);
// 						break;
// 					case "DEPT_LESS":
// 						deptlessModelList.add(model_);
// 						break;
// 					case "SHARE_LESS":
// 						sharelessModelList.add(model_);
// 						break;
// 					case "PER_LESS":
// 						perlessModelList.add(model_);
// 						break;
// 					case "PBR_LESS":
// 						pbrlessModelList.add(model_);
// 						break;
// 					case "PSR_LESS":
// 						psrlessModelList.add(model_);
// 						break;
// 					case "PROFIT_LESS":
// 						profitlessModelList.add(model_);
// 						break;
// 					case "OTHER":
// 						otherModelList.add(model_);
export enum SutableType {
  SUTABLE,
  CASH_LESS,
  DEPT_LESS,
  SHARE_LESS,
  PER_LESS,
  PBR_LESS,
  PSR_LESS,
  PROFIT_LESS,
  OTHER,
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

  @Column({type:'int'})
  rank:number;

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

  @Column({ type: 'decimal', nullable: false, array:true })
  year_sales: number[];
  @Column({ type: 'decimal', nullable: false, array:true })
  current_quarter_sales:number[];

  @Column({ type: 'decimal', nullable: false })
  sale_profit_rate: number;
  @Column({ type: 'decimal', nullable: false })
  sale_pure_profit_rate: number;
  @Column({ type: 'decimal', nullable: false })
  dept_rate: number;
  @Column({ type: 'decimal', nullable: false })
  psr_rate: number;
  @Column({ type: 'decimal', nullable: false })
  cash_rate:number;

  @Column({
    type: 'enum',
    enum: SutableType,
    default: SutableType.SUTABLE,
    nullable: false,
  })
  sutableType: SutableType;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  financeType: string;
}
