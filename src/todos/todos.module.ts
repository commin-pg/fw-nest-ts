import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import * as config from "config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/users.entity';
import { Todo } from './entity/todo.entity';
import { UserService } from 'src/user/user.service';
const jwtConfig = config.get("jwt");

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [TodosController],
  providers: [TodosService,UserService]
})
export class TodosModule {}
