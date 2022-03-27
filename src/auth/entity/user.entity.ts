import { Exclude } from "class-transformer";
import { Board } from "src/boards/entity/board.entity";
import { BoardComment } from "src/boards/entity/board_comment.entity";
import { Todo } from "src/todos/entitiy/todo.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['userId'])
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId:string;

    @Column()
    username:string;

    @Column({select:false})
    password:string;





    @OneToMany(type=>Board , board=> board.createBy, {eager:false})
    boards:Board[]
    
    @OneToMany(type=>BoardComment, boardComment => boardComment.createBy, {eager:false})
    boardComments:BoardComment[]

    @OneToMany(type=>Todo, todo=> todo.user, {eager:false})
    todos:Todo[]
}