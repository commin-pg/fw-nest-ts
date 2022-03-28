import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class BoardComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: string;

  @Column({ nullable: true })
  modifyAt: string;

  @Column({ nullable: true, type:'varchar'})
  modifyBy: string;

  @ManyToOne((type) => User, (user) => user.boardComments, { eager: true })
  createBy: User;

  @ManyToOne((type) => Board, (board) => board.boardComments, { eager: false })
  board: Board;
}
