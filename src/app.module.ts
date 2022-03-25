import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';


@Module({
  imports: [ TypeOrmModule.forRoot(typeORMConfig) ,BoardsModule, AuthModule, TodosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
