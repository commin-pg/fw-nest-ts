import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class MyInvestment {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ comment: '생성일' })
    regDate: Date;

    @UpdateDateColumn({ comment: '수정일' })
    modifyAt: Date;

    @ApiProperty({ description: '투자금' })
    @Column({ type: 'varchar', nullable: false, comment: '투자금' })
    investmentAmount: string;

    @ApiProperty({ description: '비상금 %' })
    @Column({ type: 'int', nullable: false, default: 10, comment: '비상금 %' })
    emergencyRate: number;

    @ApiProperty({ description: '한 종목당 비중을 구하기 위해 나누는 값' })
    @Column({ type: 'int', nullable: false, default: 10, comment: '한 종목당 비중을 구하기 위해 나누는 값' })
    perDiv: number;

    @ApiProperty({ description: '스윙 주 여부' })
    @Column({ type: 'bool', nullable: false, default: false, comment: '스윙 주 여부' })
    swing: boolean;


    @OneToOne((type) => User, (user) => user.myInvestment, { eager: true })
    @JoinColumn()
    user: User;

}