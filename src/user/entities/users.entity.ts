import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

}