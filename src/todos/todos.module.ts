import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TodoItem } from './entitiy/todo_item.entity';
import { Todo } from './entitiy/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoItem]), AuthModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
