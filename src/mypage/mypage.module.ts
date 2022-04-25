import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyInvestment } from './entity/my_investment.entity';
import { MyInvestHist } from './entity/my_invest_hist.entity';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';


@Module({
  imports: [TypeOrmModule.forFeature([MyInvestment, MyInvestHist])],
  controllers: [MypageController],
  providers: [MypageService]
})
export class MypageModule { }
