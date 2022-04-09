import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from 'src/auth/entity/user.entity';
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
  ) { }

  async test() {
    const model: Finance = new Finance();
    model.compayFinanceDetailUrl =
      'https://finance.naver.com/item/main.naver?code=005930';
    model.totalMarketCap = 419078;
    const result = await this.financeFunc.sutableCheck(model);
    console.log(model, result);
  }


  // async getPagingBoard(query: PaginateQuery): Promise<Paginated<Board>> {
  //   return paginate(query, this.boardRepository, {
  //     sortableColumns: ['id', 'title'],
  //     searchableColumns: ['title', 'content'],
  //     defaultSortBy: [['id', 'DESC']],
  //     relations: ['createBy'],
  //   });
  // }

  async getCurrentDateKey(): Promise<Finance> {
    const result = await this.financeRepository
      .createQueryBuilder('finance')
      .select('finance.date_key', 'dateKey')
      .groupBy('finance.date_key')
      .orderBy('finance.date_key', 'DESC').getRawOne();
    return result;
  }


  async getFinanceAll(user: User, query: PaginateQuery): Promise<Paginated<Finance>> {
    const dateKeyQuery = await this.financeRepository
      .createQueryBuilder('finance')
      .select('finance.date_key', 'dateKey')
      .groupBy('finance.date_key')
      .orderBy('finance.date_key', 'DESC')
      .getRawOne();

    return this.getCurrentDateKey().then(res => {
      console.log(res)
      const financeQuery = this.financeRepository
        .createQueryBuilder('finance')
        .where('finance.date_key = :dateKey', { dateKey: res.dateKey })
        .orderBy('finance.id', 'ASC')
        .orderBy('finance.date_key', 'DESC')

      return paginate(query, financeQuery, {
        sortableColumns: ['id', 'dateKey'],
        searchableColumns: ['compayName', 'dateKey', 'sutableType'],
        defaultSortBy: [['dateKey', 'DESC']],
        filterableColumns: {
          sutableType: [FilterOperator.EQ]
        }
        // relations: ['createBy'],
      });
    }).catch(e => {
      throw e;
    })

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
