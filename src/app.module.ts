import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { FinanceModule } from './finance/finance.module';


@Module({
  imports: [ TypeOrmModule.forRoot(typeORMConfig) ,BoardsModule, AuthModule, TodosModule, FinanceModule],
  controllers: [],
  providers: [{
    provide:APP_GUARD,
    useClass: JwtAuthGuard
  }],
})
export class AppModule {}
