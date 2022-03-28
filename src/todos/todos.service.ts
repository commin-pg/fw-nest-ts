import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from 'src/auth/entity/user.entity';
import { MetadataAlreadyExistsError, Repository } from 'typeorm';
import { CreateTodoItemDTO } from './dto/create-todo-item.dto';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UpdateTodoItemDTO } from './dto/update-todo-item.dto';
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

  async createTodo(createTodo: CreateTodoDTO, user: User): Promise<Todo> {
    // const todo = this.todoRepository.findOne({dateTitle:createTodo.dateTitle})

    console.log('req', createTodo, user);
    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.dateTitle = :dateTitle and todo.userId = :userId', {
        dateTitle: createTodo.dateTitle,
        userId: user.id,
      })
      .getOne();

    if (todo) {
      throw new ConflictException(`Exist Todo '${createTodo.dateTitle}'`);
    } else {
      const cTo = new Todo();
      cTo.dateTitle = createTodo.dateTitle;
      cTo.user = user;

      return await this.todoRepository.save(cTo);
    }
  }

  async todoReadAll(user: User): Promise<Todo[]> {
    return await this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.todoItems', 'todo_item')
      .where('todo.userId = :userId', { userId: user.id })
      .orderBy('todo_item.id', 'ASC')
      .getMany();
  }

  async getTodoDetail(user: User, todoTitle: string): Promise<Todo> {
    return await this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.todoItems', 'todo_item')
      .where('todo.userId = :userId', { userId: user.id })
      .andWhere('todo.dateTitle = :todoTitle', { todoTitle })
      .orderBy('todo_item.id', 'ASC')
      .getOne();
  }

  async getPagingTodo(
    query: PaginateQuery,
    user: User,
  ): Promise<Paginated<Todo>> {
    console.log('QUERT', query);
    const quertBuilder = this.todoRepository
      .createQueryBuilder('todo')
      .innerJoinAndSelect('todo.user', 'user')
      .leftJoinAndSelect('todo.todoItems', 'todo_item')
      .where('todo.userId = :userId', { userId: user.id });

    return paginate(query, quertBuilder, {
      sortableColumns: ['id', 'dateTitle', 'todoItems.createAt'],
      searchableColumns: ['dateTitle'],
      defaultSortBy: [
        ['dateTitle', 'DESC'],
        ['todoItems.createAt', 'ASC'],
      ],
      relations: ['todoItems'],
    });
  }

  /* TODO ITEM */
  async createTodoItem(
    createTodoItem: CreateTodoItemDTO,
    user: User,
  ): Promise<TodoItem> {
    const todo2 = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.id = :id', { id: createTodoItem.todoId })
      .getOne()
      .then((todo) => {
        const todoItem = new TodoItem();
        todoItem.content = createTodoItem.content;
        todoItem.todo = todo;
        return this.todoItemRepository.save(todoItem);
      })
      .catch((e) => {
        throw e;
      });

    console.log(todo2);

    return todo2;
  }

  async updateTodoItem(
    updateTodo: UpdateTodoItemDTO,
    user: User,
  ): Promise<TodoItem> {
    const todo2 = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.id = :id', { id: updateTodo.todoId })
      .getOne()
      .then((todo) => {
        const todoItem = new TodoItem();
        todoItem.content = updateTodo.content;
        todoItem.complete = updateTodo.complete;
        todoItem.completeAt = new Date().toISOString();
        todoItem.id = updateTodo.todoItemId;
        todoItem.todo = todo;
        return this.todoItemRepository.save(todoItem);
      })
      .catch((e) => {
        throw e;
      });

    console.log(todo2);

    return todo2;
  }

  async deleteTodo(deleteId:number, user:User):Promise<any>{
    console.log(deleteId)
    const result = await this.todoRepository
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.user', 'user')
      .where('board.id = :boardId and user.id = :userId', {
        boardId: deleteId,
        userId: user.id,
      })
      .getOne()
      .then((board) => {
        if (board) {
          return this.todoRepository.delete({ id: deleteId });
        } else {
          return null;
        }
      });
    if (!result) {
      throw new ConflictException(`Can't Delete '${deleteId}'`);
    }
    return result;
  }

  async deleteTodoItem(deleteId: number, user: User): Promise<any> {
    console.log(deleteId)
    const result = await this.todoItemRepository
      .createQueryBuilder('boardComment')
      .innerJoinAndSelect('boardComment.todo', 'todo')
      .where('boardComment.id = :boardCommentId and todo.userId = :userId', {
        boardCommentId: deleteId,
        userId: user.id,
      })
      .getOne()
      .then((boardComment) => {
        if (boardComment) {
          return this.todoItemRepository.delete({ id: deleteId });
        } else {
          return null;
        }
      });
    if (!result) {
      throw new ConflictException(`Can't Delete '${deleteId}'`);
    }
    return result;
  }
}
