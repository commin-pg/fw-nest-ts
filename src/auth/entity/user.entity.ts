import { Exclude } from "class-transformer";
import { Board } from "src/boards/entity/board.entity";
import { BoardComment } from "src/boards/entity/board_comment.entity";

import { Finance } from "src/finance/entity/finance.entity";
import { FinanceCandidate } from "src/finance/entity/finance_candidate.entity";
import { FinanceCrawlingProgress } from "src/finance/entity/finance_crawling_progress.entity";
import { FinanceDelete } from "src/finance/entity/finance_delete.entity";
import { MyInvestment } from "src/mypage/entity/my_investment.entity";
import { MyInvestHist } from "src/mypage/entity/my_invest_hist.entity";
import { Todo } from "src/todos/entitiy/todo.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['userId'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    username: string;

    @Column({ select: false })
    password: string;





    @OneToMany(type => Board, board => board.createBy, { eager: false })
    boards: Board[]

    @OneToMany(type => BoardComment, boardComment => boardComment.createBy, { eager: false })
    boardComments: BoardComment[]

    @OneToMany(type => Todo, todo => todo.user, { eager: false })
    todos: Todo[]

    @OneToMany(type => Finance, finance => finance.user, { eager: false })
    finances: Finance[]

    @OneToMany(type => FinanceDelete, financeDelete => financeDelete.user, { eager: false })
    financeDeletes: FinanceDelete[]

    @OneToMany(type => FinanceCandidate, financeCandidate => financeCandidate.user, { eager: false })
    financeCandidates: FinanceCandidate[]

    @OneToMany(type => MyInvestHist, investHist => investHist.user, { eager: false })
    investHists: MyInvestHist[]


    @OneToOne(type => FinanceCrawlingProgress, financeCrawling => financeCrawling.user, { eager: false })
    financeCrawlingProgress: FinanceCrawlingProgress


    @OneToOne(type => MyInvestment, myInvestment => myInvestment.user, { eager: false })
    myInvestment: MyInvestment
}