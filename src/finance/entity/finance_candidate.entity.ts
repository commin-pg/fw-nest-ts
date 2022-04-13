import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Finance } from "./finance.entity";

@Entity()
export class FinanceCandidate {
    @PrimaryGeneratedColumn()
    id: number;


    @CreateDateColumn({ comment: '생성일' })
    regDate: Date;

    @UpdateDateColumn({ comment: '수정일' })
    modifyAt: Date;


    @Column({ type: 'varchar', nullable: false, primary: true, unique: true })
    compayName: string;

    @Column({ type: 'varchar' })
    compayFinanceDetailUrl: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    financeType: string;

    @ManyToOne((type) => User, (user) => user.financeCandidates, { eager: true })
    user: User;
}