import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/auth/decorator/public.decorator';
import { FinanceService } from './finance.service';

@Controller('/api/finance')
@ApiTags('Finance API')
@ApiBearerAuth('accessToken')
export class FinanceController {
  constructor(private financeService: FinanceService) { }

  @Get('/crwaling')
  async crwaling(@Req() req) {
    return await this.financeService.crwalingNaver(req.user);
    //  await this.financeService.test();
  }

  @Get('/all')
  async getFinanceAll(@Req() req, @Paginate() query: PaginateQuery) {
    return await this.financeService.getFinanceAll(req.user, query);
  }

  @Get('/getCurrentDateKey')
  async getCurrentDateKey(@Req() req) {
    return await this.financeService.getCurrentDateKey(req.user);
  }


  @Delete('/delete/:financeId')
  async financeDelete(@Req() req, @Param('financeId') financeId: number) {
    return await this.financeService.financeDelete(req.user, financeId);
  }

  @Delete('/restore/:financeDeleteId')
  async financeRestore(@Req() req, @Param('financeDeleteId') financeDeleteId: number) {
    return await this.financeService.financeRestore(req.user, financeDeleteId);
  }

  @Get('/deletedList')
  async financeDeletedList(@Req() req) {
    return await this.financeService.financeDeletedList(req.user);
  }

}
