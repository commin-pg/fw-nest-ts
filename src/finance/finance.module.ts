import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestCrawlerModule } from 'nest-crawler';

import { AuthModule } from 'src/auth/auth.module';
import { Finance } from './entity/finance.entity';
import { FinanceController } from './finance.controller';
import { FinanceFunc } from './finance.func';
import { FinanceService } from './finance.service';

@Module({
  imports:[TypeOrmModule.forFeature([Finance]),
  AuthModule,NestCrawlerModule],
  controllers: [FinanceController],
  providers: [FinanceService,FinanceFunc]
})
export class FinanceModule {}
