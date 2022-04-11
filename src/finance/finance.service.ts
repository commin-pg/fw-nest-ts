import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateProgressDTO } from './dto/update-progress.dto';
import { Finance } from './entity/finance.entity';
import { FinanceCrawlingProgress, ProgressType } from './entity/finance_crawling_progress.entity';
import { FinanceDelete } from './entity/finance_delete.entity';
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
    @InjectRepository(FinanceDelete) private financeDeleteRepository: Repository<FinanceDelete>,
    @InjectRepository(FinanceCrawlingProgress) private financeCrawlingProgressRepository: Repository<FinanceCrawlingProgress>,
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

  async getCurrentDateKey(user: User): Promise<Finance> {
    const result = await this.financeRepository
      .createQueryBuilder('finance')
      .select('finance.date_key', 'dateKey')
      .where('finance.user_id = :userId', { userId: user.id })
      .groupBy('finance.date_key')
      .orderBy('finance.date_key', 'DESC').getRawOne();
    return result;
  }


  async getFinanceAll(user: User, query: PaginateQuery): Promise<Paginated<Finance>> {
    // const dateKeyQuery = await this.financeRepository
    //   .createQueryBuilder('finance')
    //   .select('finance.date_key', 'dateKey')
    //   .groupBy('finance.date_key')
    //   .orderBy('finance.date_key', 'DESC')
    //   .getRawOne();

    return this.getCurrentDateKey(user).then(res => {
      console.log(res)
      const financeQuery = this.financeRepository
        .createQueryBuilder('finance')
        .where('finance.user_id = :userId', { userId: user.id })
        .orderBy('finance.id', 'ASC')
        .orderBy('finance.date_key', 'DESC')

      return paginate(query, financeQuery, {
        sortableColumns: ['id', 'dateKey'],
        searchableColumns: ['compayName'],
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

  async crwalingNaver(user: User) {
    return this.financeDeletedList(user).then(deleteList => {
      const delList: string[] = deleteList.map(deletedCompanyNameList => deletedCompanyNameList.compayName);
      return this.financeFunc
        .crwaling(user, delList)
        .then((result) => {
          return this.financeRepository
            .createQueryBuilder('finance')
            .delete()
            .where('user_id = :userId', { userId: user.id })
            .execute()
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
    })

  }

  async financeDelete(user: User, financeId: number) {
    return this.financeRepository
      .createQueryBuilder('finance')
      .select()
      .where('finance.id = :financeId', { financeId })
      .getOne()
      .then(result => {
        return this.financeDeleteRepository.save(
          {
            compayName: result.compayName,
            compayFinanceDetailUrl: result.compayFinanceDetailUrl,
            financeType: result.financeType,
            user
          }
        ).then(res => {
          return this.financeRepository
            .createQueryBuilder('finance')
            .delete()
            .where('finance.id = :financeId', { financeId })
            .execute()
            .catch(e => {
              throw e;
            })
        }).catch(e => {
          throw e;
        })
      }).catch(e => {
        throw e;
      })
  }

  async financeRestore(user: User, financeDeleteId: number) {
    return this.financeDeleteRepository
      .createQueryBuilder('financeDelete')
      .delete()
      .where('id = :financeDelId and user_id = :userId', { financeDelId: financeDeleteId, userId: user.id })
      .execute()
      .catch(e => { throw e })
  }

  async financeDeletedList(user: User): Promise<FinanceDelete[]> {
    return this.financeDeleteRepository
      .createQueryBuilder('financeDelete')
      .select()
      .where('financeDelete.user_id = :userId', { userId: user.id })
      .orderBy('financeDelete.reg_date')
      .getMany()
      .catch(e => {
        throw e;
      })
  }

  async getFinanceProgress(user: User) {
    return await this.financeCrawlingProgressRepository.createQueryBuilder('FinanceCrawlingProgress')
      .select()
      .where('FinanceCrawlingProgress.user_id = :userId', { userId: user.id })
      .getOne()
      .then(result => {
        if (result) {
          return result;
        } else {
          return this.financeCrawlingProgressRepository.save({
            process: 0,
            progressType: ProgressType.NONE,
            user: user
          })

        }
      })
      .catch(e => {
        throw e
      })
  }

  async setFinanceProgress(user: User, updateProgressDTO: UpdateProgressDTO) {
    const { process, progressType } = updateProgressDTO;
    return await this.financeCrawlingProgressRepository.createQueryBuilder('FinanceCrawlingProgress')
      .select()
      .where('FinanceCrawlingProgress.user_id = :userId', { userId: user.id })
      .getOne()
      .then(result => {

        if (result) {

          this.financeCrawlingProgressRepository.createQueryBuilder('FinanceCrawlingProgress')
          .update()
          .set(
            {
              process: progressType === ProgressType.COMPLETE? 100: process,
              progressType: progressType,
            }
          )
          .where("user_id = :userId", { userId: user.id })
          .execute()

          return this.getFinanceProgress(user);
        
        } else {
          throw new ConflictException('Progress Data Empty..');
        }
      })
      .catch(e => {
        throw e;
      })
  }
}
