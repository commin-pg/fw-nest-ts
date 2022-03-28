import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { FinanceService } from './finance.service';

@Controller('finance')
@ApiTags('Finance API')
export class FinanceController {
    constructor(private financeService:FinanceService){}

    @Public()
    @Get()
    crwaling(){
        this.financeService.crwaling();
    }
}
