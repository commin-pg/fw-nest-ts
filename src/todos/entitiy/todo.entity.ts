import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoItem } from './todo_item.entity';

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  dateTitle: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: string;

  @OneToMany((type) => TodoItem, (todoItem) => todoItem.todo, { eager: false , nullable:true})
  todoItems: TodoItem[];

  @ManyToOne((type) => User, (user) => user.todos, { eager: false, nullable:false })
  user: User;
}
