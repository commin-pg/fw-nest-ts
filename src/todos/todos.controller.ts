import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreateTodoItemDTO } from './dto/create-todo-item.dto';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UpdateTodoItemDTO } from './dto/update-todo-item.dto';
import { Todo } from './entitiy/todo.entity';
import { TodosService } from './todos.service';

@Controller('/api/todos')
@ApiTags('TODO')
@ApiBearerAuth('accessToken')
export class TodosController {
  constructor(private todoService: TodosService) {}

  // Cretae
  @Post('')
  @UseGuards(AuthGuard())
  createTodo(@Req() req, @Body() createTodoDto: CreateTodoDTO): Promise<any> {
    return this.todoService.createTodo(createTodoDto, req.user);
  }

  @Post('/item')
  @UseGuards(AuthGuard())
  createTodoItem(
    @Req() req,
    @Body() createTodoItem: CreateTodoItemDTO,
  ): Promise<any> {
    return this.todoService.createTodoItem(createTodoItem, req.user);
  }

  // Read

  @Get('/all')
  @UseGuards(AuthGuard())
  todoReadAll(@Req() req): Promise<Todo[]> {
    return this.todoService.todoReadAll(req.user);
  }

  @Get('/detail/:todoTitle')
  @UseGuards(AuthGuard())
  getTodoDetail(
    @Req() req,
    @Param('todoTitle') todoTitle: string,
  ): Promise<Todo> {
    return this.todoService.getTodoDetail(req.user, todoTitle);
  }

  // 페이징해서 가져오기
  @Get('/page')
  getPagingBoard(@Paginate() query: PaginateQuery): Promise<Paginated<Todo>> {
    return this.todoService.getPagingTodo(query);
  }

  // Update

  @Put('/item')
  @UseGuards(AuthGuard())
  updateTodoItem(
    @Req() req,
    @Body() updateTodoItemDTO: UpdateTodoItemDTO,
  ): Promise<any> {
    return this.todoService.updateTodoItem(updateTodoItemDTO, req.user);
  }

  // Delete

  @Delete('/item/delete/:id')
  @UseGuards(AuthGuard())
  deleteTodoItem(@Req() req, @Param('id') deleteId: number) {
    this.todoService.deleteTodoItem(deleteId, req.user);
  }
}
