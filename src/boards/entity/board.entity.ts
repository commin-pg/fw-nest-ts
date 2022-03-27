import { Exclude } from 'class-transformer';
import { type } from 'os';
import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardComment } from './board_comment.entity';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: string;

  @Column({ nullable: true })
  modifyAt: string;
  @Column({ nullable: true, type: 'varchar' })
  modifyBy: string;

  @Column({ type: 'int', default: 0 })
  viewCnt: number;

  // @Column() createdAt: string = DateTime.now().toISO();

  @ManyToOne((type) => User, (user) => user.boards, { eager: true })
  createBy: User;

  @OneToMany((type) => BoardComment, (boardComment) => boardComment.board, {
    eager: true,
    nullable: true,
  })
  boardComments: BoardComment[];
}
