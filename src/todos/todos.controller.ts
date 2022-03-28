import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req
} from '@nestjs/common';
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
// @UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todoService: TodosService) {}

  // Cretae
  @Post('')
  createTodo(@Req() req, @Body() createTodoDto: CreateTodoDTO): Promise<any> {
    return this.todoService.createTodo(createTodoDto, req.user);
  }

  @Post('/item')
  createTodoItem(
    @Req() req,
    @Body() createTodoItem: CreateTodoItemDTO,
  ): Promise<any> {
    return this.todoService.createTodoItem(createTodoItem, req.user);
  }

  // Read


  @Get('/all')
  todoReadAll(@Req() req): Promise<Todo[]> {
    console.log(req.user)
    return this.todoService.todoReadAll(req.user);
  }

  @Get('/detail/:todoTitle')
  getTodoDetail(
    @Req() req,
    @Param('todoTitle') todoTitle: string,
  ): Promise<Todo> {
    return this.todoService.getTodoDetail(req.user, todoTitle);
  }

  // 페이징해서 가져오기
  @Get('/page')
  getPagingBoard(@Paginate() query: PaginateQuery,@Req() req): Promise<Paginated<Todo>> {
    return this.todoService.getPagingTodo(query, req.user);
  }

  // Update

  @Put('/item')
  updateTodoItem(
    @Req() req,
    @Body() updateTodoItemDTO: UpdateTodoItemDTO,
  ): Promise<any> {
    return this.todoService.updateTodoItem(updateTodoItemDTO, req.user);
  }

  // Delete

  @Delete('/delete/:id')
  deleteTodo(@Req() req, @Param('id') deleteId:number){
    return this.todoService.deleteTodo(deleteId, req.user);
  }

  @Delete('/item/delete/:id')
  deleteTodoItem(@Req() req, @Param('id') deleteId: number) {
   return this.todoService.deleteTodoItem(deleteId, req.user);
  }

}
