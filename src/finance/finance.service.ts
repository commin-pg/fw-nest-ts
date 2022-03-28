import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NestCrawlerService } from 'nest-crawler';
import { Repository } from 'typeorm';
import { Finance } from './entity/finance.entity';
import * as cheerio from 'cheerio';

export enum FinanceType {
  KOSPI = '0',
  KOSDAQ = '1',
}

export const FINANCE_BASE_TABLE_URL: string =
  'https://finance.naver.com/sise/sise_market_sum.nhn';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance) private financeRepository: Repository<Finance>,
    private readonly crwalerService: NestCrawlerService,
  ) {}

  async crwaling() {
    for (var i = 0; i < 2; i++) {
      for (var idx = 1; idx < 5; idx++) {
        const BASE_URL =
          FINANCE_BASE_TABLE_URL +
          '?sosok=' +
          (i === 0 ? FinanceType.KOSDAQ : FinanceType.KOSPI) +
          '&page=' +
          idx;
        // "table.type_2 > tbody > tr"
        interface HTML{
            html:string
        }
        const html: HTML = await this.crwalerService.fetch({
          target: BASE_URL,
          fetch: {
            html : {
                selector:'html',
                how:'html'
            }
          },
        });
        console.log(html);

        

        cheerio.load(html.html)('table.type_2 > tbody > tr')
        .map((index, ele)=>{
            // console.log(index, ele.text);
        })
        // cheerio.load


        
      }
    }
  }
}
