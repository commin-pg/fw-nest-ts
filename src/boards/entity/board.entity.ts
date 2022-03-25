import { Exclude } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    content:string;

    @Column({nullable:false,type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createAt:string;

    @Column({nullable:true})
    modifyAt:string;
    @Column({nullable:true, type:'varchar'})
    modifyBy:string;


    @Column({type:'int', default:0})
    viewCnt:number

    // @Column() createdAt: string = DateTime.now().toISO();

    @ManyToOne(type=>User, user=> user.boards,{eager:true})
    createBy:User;

}