import {
  Body,
  Controller,
  Delete,
  Get, Param,
  Post,
  Put,
  Req, UseGuards, UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BoardsService } from './boards.service';
import {  CreateBoardCommentDTO } from './dto/create-board-comment.dto';
import { CreateBoardDTO } from './dto/create-board.dto';
import { UpdateBoardCommentDTO } from './dto/update-board-comment.dto';
import { UpdateBoardDTO } from './dto/update-board.dto';
import { Board } from './entity/board.entity';
import { BoardComment } from './entity/board_comment.entity';

@Controller('/api/boards')
@ApiTags('게시판 API')
// @UseGuards(AuthGuard())
@ApiBearerAuth('accessToken')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  // 생성하기
  @Post()
  @UseGuards(AuthGuard())
  createBoard(
    @Req() req,
    @Body() createBoardDTO: CreateBoardDTO,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardDTO, req.user);
  }

  @Post('/comment')
  @UseGuards(AuthGuard())
  createBoardComment(@Req() req, @Body() createBoardCommentDTO:CreateBoardCommentDTO):Promise<BoardComment>{
    return this.boardService.createBoardComment(createBoardCommentDTO,req.user);
  }

  // 다 가져오기
  @Get()
  getAllBoard(): Promise<Board[]> {
    return this.boardService.getAllBoard();
  }

  // 페이징해서 가져오기
  @Get('page')
  getPagingBoard(@Paginate() query: PaginateQuery): Promise<Paginated<Board>> {
    return this.boardService.getPagingBoard(query);
  }

  // ID 값 받아서 가져오기

  @Get('/:id')
  getBoardByID(@Param('id') id: number): Promise<Board> {
    return this.boardService.getBoardById(id).then(board => {
      return this.boardService.plusViewCnt(board);
    })
    
  }

  // Update
  @Put('/update')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  updateBoard(@Req() req, @Body() updateBoardDTO: UpdateBoardDTO) {
    return this.boardService.updateBoard(updateBoardDTO, req.user);
  }

  @Put('/comment/update')
  @UseGuards(AuthGuard())
  updateBoardComment(@Req() req, @Body() updateBoardComment: UpdateBoardCommentDTO){
    return this.boardService.updateBoardComment(updateBoardComment,req.user);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: number, @Req() req) {
    return this.boardService
      .deleteBoard(id, req.user)
      .then((result) => result)
      .catch((e) => {
        throw e;
      });
  }


  @Delete('/comment/delete/:commentId')
  @UseGuards(AuthGuard())
  removeBoardComment(@Param('commentId') commentId: number, @Req() req) {
    return this.boardService
      .deleteBoardComment(commentId, req.user)
      .then((result) => result)
      .catch((e) => {
        throw e;
      });
  }
}
