import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'user id', example:'khm0813' })
  userId: string;

  @IsString()
  @ApiProperty({ description: 'user name', example:'khm' })
  userName: string;

  @IsString()
  @ApiProperty({ description: 'user password', example:'khm0813' })
  password: string;

  @IsString()
  @ApiProperty({ description: 'user role', example:'admin',pattern:'(admin)|(normal)' })
  role: string;
}