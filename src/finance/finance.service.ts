import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Finance } from './entity/finance.entity';
import * as cheerio from 'cheerio';
import * as sanitizeHtml from 'sanitize-html';

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

  ) {}

  async crwaling() {
    for (var i = 0; i < 1; i++) {
      for (var idx = 1; idx < 5; idx++) {
        const BASE_URL =
          FINANCE_BASE_TABLE_URL +
          '?sosok=' +
          (i === 0 ? FinanceType.KOSPI : FinanceType.KOSDAQ) +
          '&page=' +
          idx;
        // "table.type_2 > tbody > tr"

        // interface HTML {
        //   html: string;
        // }

        // const html: HTML = await this.crwalerService.fetch({
        //   target: BASE_URL,

        //   fetch: {
        //     html: {
        //       selector: 'html',
        //       how: 'html',
        //     },
        //   },
        // });
        // console.log(html);

        // var cnt = 0;
        // cheerio
        //   .load(html.html, { decodeEntities: true })(
        //     'table.type_2 > tbody > tr',
        //   )
        //   .map((index, ele) => {

        // console.log(index, cheerio.load(ele)('td > a.title').text());
        // console.log(index, cheerio.load(ele)('td > a.title').text());
        // if (cheerio.load(ele)('td > a').attr('href')) {
        //   cnt = cnt + 1;
        //   console.log(cnt, cheerio.load(ele)('td.no').text());
        //   console.log(cnt, cheerio.load(ele)('td > a').attr('href'));
        //   console.log(ele)
        //   console.log(
        //     cnt,
        //     sanitizeHtml(
        //       cheerio.load(ele, { decodeEntities: true })('td > a').html(),
        //       { parser: { decodeEntities: true } },
        //     ),
        //   );

        //   console.log(
        //     cnt,
        //     sanitizeHtml(
        //       '<html>가나다</html>',
        //       { parser: { decodeEntities: true } },
        //     ),
        //   );
        // }
        // });
        // cheerio.load
      }
    }
  }
}
