import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";




export class MyInvestmentRequestDTO {

    @IsNotEmpty()
    @ApiProperty({ description: '투자금' })
    investmentAmount: string;

    @ApiProperty({ description: '비상금 %', default: 10 })
    emergencyRate: number;

    @ApiProperty({ description: '한 종목당 비중을 구하기 위해 나누는 값', default: 10 })
    perDiv: number;

    @ApiProperty({ description: '스윙 주 여부', default: false })
    swing: boolean;
}