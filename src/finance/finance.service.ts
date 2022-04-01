import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance } from './entity/finance.entity';
import { FinanceFunc } from './finance.func';
import { formatYMD } from './finance.util';

export enum FinanceType {
  KOSPI = '0',
  KOSDAQ = '1',
}

export const FINANCE_BASE_URL = 'https://finance.naver.com';
export const FINANCE_BASE_TABLE_URL: string =
  'https://finance.naver.com/sise/sise_market_sum.nhn';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance) private financeRepository: Repository<Finance>,
    private financeFunc: FinanceFunc,
  ) {}

  async test() {
    const model: Finance = new Finance();
    model.compayFinanceDetailUrl =
      'https://finance.naver.com/item/main.naver?code=005930';
    model.totalMarketCap = 419078;
    const result = await this.financeFunc.sutableCheck(model);
    console.log(model, result);
  }

  async crwalingNaver() {
    return await this.financeFunc
      .crwaling()
      .then((result) => {
        return this.financeRepository
          .delete({ dateKey: formatYMD(new Date()) })
          .then((delResult) => {
            console.log(delResult);
            this.financeRepository.save(result);
            return {
              resultCnt: result.length,
            };
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        console.log(e);
        return {
          resultCnt: 0,
        };
      });
  }
}
