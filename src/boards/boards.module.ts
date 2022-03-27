import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from './entity/board.entity';
import { BoardComment } from './entity/board_comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Board,BoardComment]),
AuthModule],
  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule {
  
}
