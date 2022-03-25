import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/users.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateTodoDTO } from "./dto/create-todo.dto";
import { Todo } from "./entity/todo.entity";

@Injectable()
export class TodosService {
    
  constructor(
    @InjectRepository(Todo) private todoRepo: Repository<Todo>,
    private userService:UserService
  ) {
      
  }

  // Create
  async createTodo(createTodo: CreateTodoDTO): Promise<Todo> {


    const todo = await this.userService.findOneByUserSeq(createTodo.userSeq)
      .then((user) => {
        return this.todoRepo.save({
          complete: false,
          content: createTodo.content,
          title: createTodo.title,
          user: user
        });
      });

    return todo;
  }

  // Read

  // Update

  // Delete
}
