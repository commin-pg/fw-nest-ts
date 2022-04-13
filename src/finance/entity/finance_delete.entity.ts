import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class FinanceDelete {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ comment: '생성일' })
    regDate: Date;

    @UpdateDateColumn({ comment: '수정일' })
    modifyAt: Date;

    @Column({ type: 'varchar', nullable: false, primary: true })
    compayName: string;

    @Column({ type: 'varchar' })
    compayFinanceDetailUrl: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    financeType: string;

    @ManyToOne((type) => User, (user) => user.financeDeletes, { eager: true })
    user: User;

}