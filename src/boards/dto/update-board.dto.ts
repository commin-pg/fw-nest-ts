import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { BoardStatus } from "../board.enum";

export class UpdateBoardDTO{
    @IsNotEmpty()
    @ApiProperty({ description: 'id', example:'1' })
    id:number;

    @IsNotEmpty()
    @ApiProperty({ description: 'title', example:'title' })
    title:string;
    
    @IsNotEmpty()
    @ApiProperty({ description: 'content', example:'content' })
    content:string;
 
}