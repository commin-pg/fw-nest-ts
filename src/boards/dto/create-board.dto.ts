import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBoardDTO{
    @IsNotEmpty()
    @ApiProperty({ description: 'title', example:'title' })
    title:string;
    
    @IsNotEmpty()
    @ApiProperty({ description: 'content', example:'content' })
    content:string;
}