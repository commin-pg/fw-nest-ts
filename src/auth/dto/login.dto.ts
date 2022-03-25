import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDTO{
    @IsNotEmpty()
    @ApiProperty({ description: 'userId', example:'userId' })
    userId:string;
    @IsNotEmpty()
    @ApiProperty({ description: 'password', example:'password' })
    password:string;
}