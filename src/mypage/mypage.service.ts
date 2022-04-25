import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssertionError } from 'assert';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { MyInvestHistRequest } from './dto/my-invest-hist.request';
import { MyInvestmentRequestDTO } from './dto/my-investment.request';
import { MyInvestment } from './entity/my_investment.entity';
import { MyInvestHist } from './entity/my_invest_hist.entity';

@Injectable()
export class MypageService {
    constructor(@InjectRepository(MyInvestment) private myInvestmentRepository: Repository<MyInvestment>,
        @InjectRepository(MyInvestHist) private myInvestHistRepository: Repository<MyInvestHist>,) { }

    async getMyInvestmentInfo(user: User) {
        return this.myInvestmentRepository.createQueryBuilder('myInvestment')
            .select()
            .where('user_id = :userId', { userId: user.id })
            .getOne()
            .then(result => {
                return result;
            }).catch(e => {
                throw e;
            })
    }

    async clearMyInvestmentInfo(user: User) {
        return this.myInvestmentRepository.createQueryBuilder('investment')
            .delete()
            .where('user_id = :userId', { userId: user.id })
            .execute()
            .catch(e => {
                throw e;
            })
    }

    async setMyInvestInfo(user: User, request: MyInvestmentRequestDTO) {
        return this.getMyInvestmentInfo(user).then(result => {
            console.log(result)
            var preInvestmentAmount = null;
            if (result)
                preInvestmentAmount = result.investmentAmount;

            if (result) {
                result.emergencyRate = request.emergencyRate;
                result.investmentAmount = request.investmentAmount;
                result.swing = request.swing;
                result.perDiv = request.perDiv;
                return this.myInvestmentRepository.save(result).then(
                    saved => {
                        // 이력 추가 생성
                        if (Number(preInvestmentAmount) !== Number(request.investmentAmount)) {
                            var hist: MyInvestHistRequest = new MyInvestHistRequest();
                            hist.newInvestmentAmount = result.investmentAmount;
                            hist.preInvestmentAmount = preInvestmentAmount;
                            this.addInvestHist(user, hist);
                        }

                        return result;
                    }
                ).catch(e => {
                    throw e;
                })
            } else {
                const saved = {
                    investmentAmount: request.investmentAmount,
                    emergencyRate: request.emergencyRate,
                    perDiv: request.perDiv,
                    swing: request.swing,
                    user
                }
                return this.myInvestmentRepository.createQueryBuilder()
                    .insert()
                    .into(MyInvestment)
                    .values([
                        saved
                    ])
                    .execute().then(result => {

                        // 이력 새로 생성.
                        var hist: MyInvestHistRequest = new MyInvestHistRequest();
                        hist.newInvestmentAmount = saved.investmentAmount;
                        hist.preInvestmentAmount = '0';

                        this.addInvestHist(user, hist);
                        return saved;
                    })
                    .catch(e => {
                        throw e;
                    })
            }
        })


    }

    async addInvestHist(user: User, request: MyInvestHistRequest) {
        var data: MyInvestHist = new MyInvestHist();
        data.user = user;
        data.newInvestmentAmount = request.newInvestmentAmount;
        data.preInvestmentAmount = request.preInvestmentAmount;

        return await this.myInvestHistRepository.createQueryBuilder('hist')
            .insert()
            .into(MyInvestHist)
            .values([
                data
            ]).execute()
            .then(result => {
                return result;
            }).catch(e => {
                throw e;
            })

    }

    async getInvestHist(user: User, query: PaginateQuery): Promise<Paginated<MyInvestHist>> {
        const myInvestHistQuery = this.myInvestHistRepository
            .createQueryBuilder('hist')
            .where('hist.user_id = :userId', { userId: user.id })
            .orderBy('hist.regDate', 'DESC')

        return paginate(query, myInvestHistQuery, {
            sortableColumns: ['id', 'regDate']
        });
    }

    async deleteInvestHist(user: User, id: number) {
        return await this.getMyInvestmentInfo(user).then(investInfo => {
            return this.myInvestHistRepository
                .createQueryBuilder('hist')
                .select()
                .where('id = :histId', { histId: id })
                .getOne()
                .then(hist => {
                    if (Number(hist.newInvestmentAmount) === Number(investInfo.investmentAmount)) {
                        throw new ConflictException('첫번째 이력은 지울 수 없습니다.')
                    } else {
                        return this.myInvestHistRepository
                            .createQueryBuilder('hist')
                            .delete()
                            .where('id = :histId', { histId: id })
                            .execute()
                            .catch(e => {
                                throw e;
                            })
                    }

                })


        })


    }


}
