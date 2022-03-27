import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column } from "typeorm";

export class UpdateTodoItemDTO{

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Todo의 데이트 타이틀',example: '1', nullable: false })
    todoId:number;


    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Todo Item의 PK 값',example: '1', nullable: false })
    todoItemId:number;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: 'Todo Item의 PK 값',example: false, nullable: false })
    complete: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '투두의 내용', example: 'content', nullable: false })
    content:string;

}