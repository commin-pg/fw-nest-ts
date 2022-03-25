import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { User } from 'src/auth/entity/user.entity';
import { MetadataAlreadyExistsError, Repository } from 'typeorm';
import { CreateTodoItemDTO } from './dto/create-todo-item.dto';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { Todo } from './entitiy/todo.entity';
import { TodoItem } from './entitiy/todo_item.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(TodoItem)
    private todoItemRepository: Repository<TodoItem>,
  ) {}


/* TODO */


  async createTodo(createTodo:CreateTodoDTO, user:User):Promise<Todo>{
    // const todo = this.todoRepository.findOne({dateTitle:createTodo.dateTitle})

    console.log("req", createTodo, user);
    const todo = await this.todoRepository.createQueryBuilder('todo')
    .where('todo.dateTitle = :dateTitle and todo.userId = :userId', {dateTitle:createTodo.dateTitle, userId:user.id})
    .getOne();

    if(todo){
        throw new UnauthorizedException();
    }else{

        const cTo = new Todo();
        cTo.dateTitle  = createTodo.dateTitle;
        cTo.user = user;

        return await this.todoRepository.save(cTo);
    }
     
  }


  async todoReadAll(user:User):Promise<Todo[]>{
    return await this.todoRepository.createQueryBuilder('todo')
    .leftJoinAndSelect('todo.todoItems','todo_item')
    .where('todo.userId = :userId', {userId:user.id})
    .getMany();
  }


  /* TODO ITEM */
  async createTodoItem(createTodoItem:CreateTodoItemDTO, user:User):Promise<TodoItem>{
    const todo2 = await this.todoRepository.createQueryBuilder('todo').where('todo.id = :id',{id:createTodoItem.todoId}).getOne().then((todo)=>
    {
        const todoItem = new TodoItem();
        todoItem.content = createTodoItem.content;
        todoItem.todo = todo;
        return this.todoItemRepository.save(todoItem);
    }
    ).catch(e => {throw e})

    console.log(todo2);

    return todo2
  }

  async deleteTodoItem(deleteId:number, user:User):Promise<void>{
      await this.todoItemRepository.delete({id:deleteId});
  }
}
