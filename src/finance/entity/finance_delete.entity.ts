import { User } from "src/auth/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class FinanceDelete {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    regDate: string;

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