import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestCrawlerModule } from 'nest-crawler';

import { AuthModule } from 'src/auth/auth.module';
import { Finance } from './entity/finance.entity';
import { FinanceCandidate } from './entity/finance_candidate.entity';
import { FinanceCrawlingProgress } from './entity/finance_crawling_progress.entity';
import { FinanceDelete } from './entity/finance_delete.entity';
import { FinanceController } from './finance.controller';
import { FinanceFunc } from './finance.func';
import { FinanceService } from './finance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Finance, FinanceDelete, FinanceCrawlingProgress, FinanceCandidate]),
    AuthModule, NestCrawlerModule],
  controllers: [FinanceController],
  providers: [FinanceService, FinanceFunc]
})
export class FinanceModule { }
