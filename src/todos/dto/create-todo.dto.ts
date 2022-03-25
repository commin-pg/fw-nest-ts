import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title', example: 'title', nullable: false })
  dateTitle: string;
}
