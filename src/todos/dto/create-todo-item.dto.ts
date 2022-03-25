import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Todo } from "../entitiy/todo.entity";

export class CreateTodoItemDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '투두의 내용', example: 'content', nullable: false })
    content:string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Todo의 데이트 타이틀',example: '1', nullable: false })
    todoId:number;
}