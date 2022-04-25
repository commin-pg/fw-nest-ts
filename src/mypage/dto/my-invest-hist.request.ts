import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";




export class MyInvestHistRequest {

    @ApiProperty({ description: '이전 투자금' })
    preInvestmentAmount: string;

    @ApiProperty({ description: '새 투자금' })
    newInvestmentAmount: string;
}