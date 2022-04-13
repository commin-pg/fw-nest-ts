import { IsEnum } from "class-validator";
import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ProgressType {
    NONE = 'NONE',
    PROCESSING = 'PROCESSING',
    COMPLETE = 'COMPLETE',
    FAIL = 'FAIL'
}


@Entity()
export class FinanceCrawlingProgress {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column({
    //     nullable: false,
    //     type: 'timestamp',
    //     default: () => 'CURRENT_TIMESTAMP',
    // })
    // regDate: string;
    @CreateDateColumn({ comment: '생성일' })
    regDate: Date;

    @UpdateDateColumn({ comment: '수정일' })
    modifyAt: Date;

    @Column({ nullable: true })
    process: number;

    @IsEnum(ProgressType)
    @Column({
        type: 'text',
        // enum: SutableType,
        default: ProgressType.NONE,
        nullable: false,
    })
    progressType: ProgressType;

    @OneToOne((type) => User, (user) => user.financeCrawlingProgress, { eager: true })
    @JoinColumn()
    user: User;
}