import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class MyInvestHist {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ comment: '생성일' })
    regDate: Date;

    @ApiProperty({ description: '이전 투자금' })
    @Column({ type: 'varchar', nullable: false, comment: '이전 투자금' })
    preInvestmentAmount: string;

    @ApiProperty({ description: '새 투자금' })
    @Column({ type: 'varchar', nullable: false, comment: '새 투자금' })
    newInvestmentAmount: string;

    @ManyToOne((type) => User, (user) => user.investHists, { eager: true })
    user: User;

}