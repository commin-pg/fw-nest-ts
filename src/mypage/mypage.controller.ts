import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { MyInvestHistRequest } from './dto/my-invest-hist.request';
import { MyInvestmentRequestDTO } from './dto/my-investment.request';
import { MyInvestHist } from './entity/my_invest_hist.entity';
import { MypageService } from './mypage.service';

@ApiTags('Mypage API')
@ApiBearerAuth('accessToken')
@Controller('api/mypage')
export class MypageController {
    constructor(private mypageService: MypageService) { }


    @Get('/getMyInvestmentInfo')
    async getMyInvestmentInfo(@Req() req) {
        return await this.mypageService.getMyInvestmentInfo(req.user);
    }

    @Post('/setMyInvestInfo')
    async setMyInvestInfo(@Req() req, @Body() request: MyInvestmentRequestDTO) {
        return await this.mypageService.setMyInvestInfo(req.user, request);
    }

    @Delete('/clearMyInvestmentInfo')
    async clearMyInvestmentInfo(@Req() req) {
        return await this.mypageService.clearMyInvestmentInfo(req.user);
    }

    //C

    @Post('/addInvestHist')
    async addInvestHist(@Req() req, @Body() request: MyInvestHistRequest) {
        return await this.mypageService.addInvestHist(req.user, request);
    }
    //R

    @Get('/getInvestHist')
    async getInvestHist(@Req() req, @Paginate() query: PaginateQuery) {
        return await this.mypageService.getInvestHist(req.user, query);
    }

    //D

    @Delete('/deleteInvestHist/:id')
    async deleteInvestHist(@Req() req, @Param('id') id: number) {
        return await this.mypageService.deleteInvestHist(req.user, id);
    }

}
