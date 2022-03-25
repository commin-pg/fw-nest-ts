import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateTodoDTO{

    @IsString()
    @ApiProperty({ description: 'user id', example:'khm0813' })
    title:string;
    @IsString()
    @ApiProperty({ description: 'user id', example:'khm0813' })
    content:string;
    @IsNumber()
    @ApiProperty({ description: 'user id', example:'khm0813' })
    userSeq:number;
}