import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class TodoItem
 extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'boolean', nullable: false, default: 0 })
  complete: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  completeAt: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: string;

  @ManyToOne((type) => Todo, (todo) => todo.todoItems, { eager: true, onDelete: 'CASCADE' })
  todo: Todo;
}
