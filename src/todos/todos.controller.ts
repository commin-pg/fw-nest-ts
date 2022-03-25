import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTodoItemDTO } from './dto/create-todo-item.dto';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { Todo } from './entitiy/todo.entity';
import { TodosService } from './todos.service';

@Controller('/api/todos')
@ApiTags('TODO')
@ApiBearerAuth('accessToken')
export class TodosController {
  constructor(private todoService: TodosService) {}

  // Cretae
  @Post('/todo')
  @UseGuards(AuthGuard())
  createTodo(@Req() req, @Body() createTodoDto: CreateTodoDTO): Promise<any> {
    return this.todoService.createTodo(createTodoDto, req.user);
  }

  @Post('/todo/item')
  @UseGuards(AuthGuard())
  createTodoItem(
    @Req() req,
    @Body() createTodoItem: CreateTodoItemDTO,
  ): Promise<any> {
    return this.todoService.createTodoItem(createTodoItem, req.user);
  }

  // Read

  @Get('/todo/all')
  @UseGuards(AuthGuard())
  todoReadAll(@Req() req): Promise<Todo[]> {
    return this.todoService.todoReadAll(req.user);
  }

  // Update

  // Delete

  @Post('/todo/item/delete/:id')
  @UseGuards(AuthGuard())
  deleteTodoItem(@Req() req, @Param('id') deleteId: number) {
    this.todoService.deleteTodoItem(deleteId, req.user);
  }
}
