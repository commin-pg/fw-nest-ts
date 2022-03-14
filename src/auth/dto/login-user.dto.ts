import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {
  @IsString()
  @ApiProperty({ description: 'user id', example:'khm0813' })
  userId: string;

  @IsString()
  @ApiProperty({ description: 'user pw', example:'1234' })
  password: string;


  
}