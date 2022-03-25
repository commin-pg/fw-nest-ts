import { Exclude } from "class-transformer";
import { Todo } from "src/todos/entity/todo.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  userName: string;

  @PrimaryColumn({unique: true})
  userId: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;


  @OneToMany(type=>Todo, todo => todo.user)
  todos: Todo[]
}