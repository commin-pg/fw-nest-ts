import { User } from "src/auth/entity/user.entity";
import { Entity, ManyToOne, OneToOne } from "typeorm";


@Entity()
export class FinanceCrawlingProgress {

    @OneToOne((type) => User, (user) => user.financeCrawlingProgress, { eager: true })
    user: User;
}