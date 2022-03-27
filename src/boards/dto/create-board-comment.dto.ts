import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBoardCommentDTO{
    @IsNotEmpty()
    @ApiProperty({ description: 'Board의 PK 값', example:'1' })
    boardId:number;
    
    @IsNotEmpty()
    @ApiProperty({ description: 'comment', example:'comment' })
    comment:string;
}