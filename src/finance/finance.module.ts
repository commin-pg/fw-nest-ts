import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { Finance } from './entity/finance.entity';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

@Module({
  imports:[TypeOrmModule.forFeature([Finance]),
  AuthModule],
  controllers: [FinanceController],
  providers: [FinanceService]
})
export class FinanceModule {}
