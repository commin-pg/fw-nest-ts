import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ProgressType } from "../entity/finance_crawling_progress.entity";



export class UpdateProgressDTO {
    @ApiProperty({ description: 'process', example: '10' })
    process: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'progressType', example: 'PROCESSING' })
    progressType: ProgressType;
}