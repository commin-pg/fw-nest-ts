import { Exclude } from "class-transformer";
import { Board } from "src/boards/entity/board.entity";
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
    
}