import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PasswordChangeDTO {

    @IsNotEmpty()
    @ApiProperty({ description: 'userId', example: 'userId' })
    userId: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'old password', example: 'password' })
    oldPassword: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'new password', example: 'password' })
    newPassword: string;
}