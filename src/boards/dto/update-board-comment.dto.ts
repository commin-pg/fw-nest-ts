import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateBoardCommentDTO{
    @IsNotEmpty()
    @ApiProperty({ description: 'Board 의 PK 값', example:'1' })
    boardId:number;

    @IsNotEmpty()
    @ApiProperty({ description: 'Board Comment의 PK 값', example:'1' })
    boardCommentId:number;
    
    @IsNotEmpty()
    @ApiProperty({ description: 'comment', example:'comment' })
    comment:string;
}