import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { Todo } from './entity/todo.entity';
import { TodosService } from './todos.service';

const logger = new Logger();
@ApiTags("투두 API")
@Controller('/api/todos')
export class TodosController {
    constructor(private todoService:TodosService){}

    @Post()
    createTodo(@Body() createTodo:CreateTodoDTO): Promise<Todo>{
        return this.todoService.createTodo(createTodo);
    }
    
}
