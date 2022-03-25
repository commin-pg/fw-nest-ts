import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthCredentialDTO{
    @ApiProperty({ description: 'userName', example:'userName' })
    username:string;
    @IsNotEmpty()
    @ApiProperty({ description: 'userId', example:'userId' })
    userId:string;
    @IsNotEmpty()
    @ApiProperty({ description: 'password', example:'password' })
    password:string;
}