import * as cheerio from 'cheerio';
import axios from 'axios';
import * as iconv from 'iconv-lite';
import { Finance, SutableType } from './entity/finance.entity';
import {
  FinanceType,
  FINANCE_BASE_TABLE_URL,
  FINANCE_BASE_URL,
} from './finance.service';
import { Injectable, Logger } from '@nestjs/common';
import { commaReplace, formatYMD } from './finance.util';
import { User } from 'src/auth/entity/user.entity';
import { FinanceDelete } from './entity/finance_delete.entity';
import { FinanceCrawlingProgress, ProgressType } from './entity/finance_crawling_progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class FinanceFunc {
  constructor(@InjectRepository(FinanceCrawlingProgress) private financeCrawlingProgressRepository: Repository<FinanceCrawlingProgress>) { }

  async sutableCheck(model: Finance) {
    // * 1. PER 15 이하 (단, 0보다 커야함)

    model.sutableType = SutableType.SUTABLE;
    model.dateKey = formatYMD(new Date());

    //		 * 저평가주여도 제외
    //		 *
    //		 * 1 홀딩스(지주회사)
    //		 *
    //		 * 2 중국주
    //		 *
    //		 * 3 우선주
    //		 *
    //		 * 4 금융주
    //		 *
    //		 * 5 신규상장주

    if (
      model.compayName.includes('홀딩스') ||
      model.compayName.includes('지주') ||
      model.compayName.includes('금융') ||
      model.compayFinanceDetailUrl.match('.*code=9.*')
    ) {
      Logger.log(`[${model.compayName}] 은 홀딩스/지주/금융/중국주 중에 하나 이므로 제외합니다.`)
      return null;
    }

    if (model.perRate && (model.perRate < 0 || model.perRate > 15)) {
      if (model.perRate > 15 && model.perRate <= 25) {
        model.sutableType = SutableType.PER_LESS;
      } else {
        Logger.log(`[${model.compayName}] 은 PER 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    // * 8. 상장주식수 1000만~8000만
    // MINIMUM_SHARES_NUMBER(1 * 10000),
    //  MAXIMUM_SHARES_NUMBER(8 * 10000),
    //  MAJI_MINIMUM_SHARES_NUMBER(1 * 5000),
    //   MAJI_MAXIMUM_SHARES_NUMBER(8 * 12000);

    if (
      model.sharesNumber &&
      (model.sharesNumber < 1 * 10000 || model.sharesNumber > 8 * 10000)
    ) {
      if (model.sharesNumber < 1 * 5000 || model.sharesNumber > 8 * 12000) {
        Logger.log(`[${model.compayName}] 은 상장주식수 가 기준에 충족하지 않습니다.`)
        return null;
      } else {
        model.sutableType = SutableType.SHARE_LESS;
      }
    }

    const tableData: void | number[] = await axios
      .get(model.compayFinanceDetailUrl, {
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
      })
      .then((result) => {
        const html = iconv.decode(result.data, 'EUC-KR').toString();
        const pbr = cheerio
          .load(html, { decodeEntities: true })(
            'div#aside > div.aside_invest_info div table.per_table tr td em#_pbr',
          )
          .text();
        model.pbrRate = Number(pbr);

        const tableData: number[] = [];

        cheerio
          .load(html, { decodeEntities: true })('div.cop_analysis tbody tr td')
          .map((index, ele) => {
            if (ele.type == 'tag') {
              //   console.log(index, ele.firstChild.data.trim());
              tableData.push(
                ele.firstChild.data?.trim()
                  ? Number(commaReplace(ele.firstChild.data.trim()))
                  : undefined,
              );
            }
          });

        return tableData;
      })
      .catch((e) => console.log(e));

    // console.log(tableData);
    // 매출액 0 ~ 3

    // 분기매출 4 ~ 9

    // 영업이익 10 ~ 13

    // 분기이익 14 ~ 19

    //
    const year_sales: number[] = [
      tableData[0] ?? 0.0,
      tableData[1] ?? 0.0,
      tableData[2] ?? 0.0,
    ];
    const current_quarter_sales: number[] = [
      tableData[4] ?? 0.0,
      tableData[5] ?? 0.0,
      tableData[6] ?? 0.0,
      tableData[7] ?? 0.0,
      tableData[8] ?? 0.0,
    ];

    // * 3. 연매출 > 시가총액
    // PSR 로 변경
    const psr_rate: number = model.totalMarketCap / year_sales[2];
    if (psr_rate <= 1) {
      model.yearSales = year_sales;
      model.currentQuarterSales = current_quarter_sales;
      model.psrRate = psr_rate;
    } else {
      if (psr_rate <= 1.2) {
        model.yearSales = year_sales;
        model.currentQuarterSales = current_quarter_sales;
        model.psrRate = psr_rate;
        if (model.sutableType === SutableType.SUTABLE) {
          model.sutableType = SutableType.PSR_LESS;
        } else {
          model.sutableType = SutableType.OTHER;
        }
      } else {
        Logger.log(`[${model.compayName}] 은 PSR 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    // * 2. PBR 1.5 이하 (단, 0보다 커야함)

    if (model.pbrRate < 0 || model.pbrRate > 1.5) {
      if (model.pbrRate > 1.5 && model.pbrRate <= 2) {
        if (model.sutableType === SutableType.SUTABLE) {
          model.sutableType = SutableType.PBR_LESS;
        } else {
          model.sutableType = SutableType.OTHER;
        }
      } else {
        Logger.log(`[${model.compayName}] 은 PBR 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    // 이익률 체크
    const sales_profits: number[] = [
      tableData[30] ?? undefined,
      tableData[31] ?? undefined,
      tableData[32] ?? undefined,
    ];

    var sale_profit_rate: number = null;
    for (var i = 0; i < sales_profits.length; i++)
      if (sales_profits[i]) sale_profit_rate = sales_profits[i];
    if (sale_profit_rate >= 3) {
      model.saleProfitRate = sale_profit_rate;
    } else {
      if (sale_profit_rate >= 1) {
        model.saleProfitRate = sale_profit_rate;
        if (model.sutableType === SutableType.SUTABLE) {
          model.sutableType = SutableType.PROFIT_LESS;
        } else {
          model.sutableType = SutableType.OTHER;
        }
      } else {
        Logger.log(`[${model.compayName}] 은 영업이익률 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    const sales_pure_profits: number[] = [
      tableData[40] ?? undefined,
      tableData[41] ?? undefined,
      tableData[42] ?? undefined,
    ];

    var sale_pure_profit_rate: number = null;
    for (var i = 0; i < sales_pure_profits.length; i++)
      if (sales_pure_profits[i]) sale_pure_profit_rate = sales_pure_profits[i];
    if (sale_pure_profit_rate >= 3) {
      model.salePureProfitRate = sale_pure_profit_rate;
    } else {
      if (sale_pure_profit_rate >= 1) {
        model.salePureProfitRate = sale_pure_profit_rate;
        if (model.sutableType === SutableType.SUTABLE) {
          model.sutableType = SutableType.PROFIT_LESS;
        } else {
          model.sutableType = SutableType.OTHER;
        }
      } else {
        Logger.log(`[${model.compayName}] 은 순이익률 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    // 부채율 체크
    const depts: number[] = [
      tableData[60],
      tableData[61] ?? undefined,
      tableData[62] ?? undefined,
    ];
    var dept_rate: number = null;
    for (var i = 0; i < depts.length; i++) if (depts[i]) dept_rate = depts[i];
    if (dept_rate <= 150) {
      model.deptRate = dept_rate;
    } else {
      if (dept_rate <= 250) {
        model.deptRate = dept_rate;
        if (model.sutableType === SutableType.SUTABLE) {
          model.sutableType = SutableType.DEPT_LESS;
        } else {
          model.sutableType = SutableType.OTHER;
        }
      } else {
        Logger.log(`[${model.compayName}] 은 부채율 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    //  유보율 체크
    const cash_rates: number[] = [
      tableData[80],
      tableData[81] ?? undefined,
      tableData[82] ?? undefined,
    ];
    var cash_rate: number = null;
    for (var i = 0; i < cash_rates.length; i++)
      if (cash_rates[i]) cash_rate = cash_rates[i];

    if (cash_rate >= 1000) {
      model.cashRate = cash_rate;
    } else {
      if (cash_rate >= 800) {
        model.cashRate = cash_rate;
        if (model.sutableType === SutableType.SUTABLE) {
          model.sutableType = SutableType.CASH_LESS;
        } else {
          model.sutableType = SutableType.OTHER;
        }
      } else {
        Logger.log(`[${model.compayName}] 은 유보율 가 기준에 충족하지 않습니다.`)
        return null;
      }
    }

    return model;

    // console.log(model);
  }

  async crwaling(user: User, deletedCompanyNameList: string[]): Promise<Finance[]> {
    const financeResultList: Finance[] = [];
    var cnt = 0;
    for (var i = 0; i < 2; i++) {
      for (var idx = 1; idx <= 50; idx++) {
        cnt++;
        const BASE_URL = FINANCE_BASE_TABLE_URL + '?sosok=' + (i === 0 ? FinanceType.KOSPI : FinanceType.KOSDAQ) + '&page=' + idx;
        await axios
          .get(BASE_URL, {
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
          })
          .then((result) => {
            const html = iconv.decode(result.data, 'EUC-KR').toString();
            var cnt = 0;
            cheerio
              .load(html, { decodeEntities: true })('table.type_2 > tbody > tr')
              .map((index, ele) => {
                if (cheerio.load(ele)('td > a').attr('href')) {
                  cnt = cnt + 1;
                  const result = new Finance();
                  result.financeType = i === 0 ? 'KOSPI' : 'KOSDAQ';
                  result.rank = Number(cheerio.load(ele)('td.no').text());
                  result.compayFinanceDetailUrl =
                    FINANCE_BASE_URL + cheerio.load(ele)('td > a').attr('href');
                  result.compayName = cheerio.load(ele)('td > a').text();
                  if (deletedCompanyNameList.includes(result.compayName)) {
                    Logger.log(`[${result.compayName}] 은 제외된 종목입니다.`)
                  } else {
                    cheerio
                      .load(ele)('td.number')
                      .map((index2, ele2) => {
                        if (ele2.type === 'tag') {
                          switch (index2) {
                            case 0: // 현재가
                              result.currentFinancePrice = Number(
                                commaReplace(ele2.firstChild.data),
                              );
                              break;
                            case 3: // 액면가
                              result.facePrice = Number(
                                commaReplace(ele2.firstChild.data),
                              );
                              break;
                            case 4: // 시가총액
                              result.totalMarketCap = Number(
                                commaReplace(ele2.firstChild.data),
                              );
                              break;
                            case 5: // 상장주식수
                              result.sharesNumber = Number(
                                commaReplace(ele2.firstChild.data),
                              );
                              break;
                            case 7: // 거래량
                              result.tradeAmount = Number(
                                commaReplace(ele2.firstChild.data),
                              );
                              break;
                            case 8: // PER
                              result.perRate = Number(ele2.firstChild.data);
                              break;
                          }
                        }
                      });
                    this.sutableCheck(result).then((model) => {

                      if (model) {
                        model.user = user;
                        financeResultList.push(model);
                      }
                    });
                  }
                }
              });
          });


        if (cnt % 10 === 0) {
          Logger.log('Progress Submit {} ', cnt)
          this.financeCrawlingProgressRepository.createQueryBuilder('FinanceCrawlingProgress')
            .update()
            .set(
              {
                // process: cnt, progressType: cnt >= 100 ? ProgressType.COMPLETE : ProgressType.PROCESSING
                process: cnt, progressType: ProgressType.PROCESSING
              }
            )
            .where("user_id = :userId", { userId: user.id })
            .execute()
            .then(result => {
              console.log(result)
            })
            .catch(e => {
              throw e;
            })
        }
      }
    }
    console.log(financeResultList);
    return financeResultList;
  }
}
