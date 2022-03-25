import { User } from "src/user/entities/users.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    complete:boolean;
    @Column()
    title:string;
    @Column()
    content:string;

    @ManyToOne(type=> User , user=> user.todos)
    user:User;
}