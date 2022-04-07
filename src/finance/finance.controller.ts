import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/auth/decorator/public.decorator';
import { FinanceService } from './finance.service';

@Controller('/api/finance')
@ApiTags('Finance API')
@ApiBearerAuth('accessToken')
export class FinanceController {
    constructor(private financeService:FinanceService){}

    @Public()
    @Get()
   async crwaling(){
      return await this.financeService.crwalingNaver();
    //  await this.financeService.test();
    }

    @Get('/all')
    async getFinanceAll(@Req() req,@Paginate() query: PaginateQuery){
      return await this.financeService.getFinanceAll(req.user,query);
    }

    @Get('/getCurrentDateKey')
    async getCurrentDateKey(){
      return await this.financeService.getCurrentDateKey();
    }
    
}
