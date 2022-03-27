import {
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryTypeFactory } from '@nestjs/graphql/dist/schema-builder/factories/query-type.factory';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { userInfo } from 'os';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { BoardStatus } from './board.enum';
import { CreateBoardCommentDTO } from './dto/create-board-comment.dto';
import { UpdateBoardCommentDTO } from './dto/update-board-comment.dto';
import { UpdateBoardDTO } from './dto/update-board.dto';
import { Board } from './entity/board.entity';
import { BoardComment } from './entity/board_comment.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardComment)
    private boardCommentRepository: Repository<BoardComment>,
  ) {}

  async createBoard({ title, content }, user: User): Promise<Board> {
    console.log(title, content);
    const createAt = new Date().toISOString();
    const board = new Board();
    board.content = content;
    board.createBy = user;
    board.title = title;
    const create = await this.boardRepository.save(board);

    return create;
  }

  async createBoardComment(
    createBoardCommentDTO: CreateBoardCommentDTO,
    user: User,
  ): Promise<BoardComment> {
    console.log(createBoardCommentDTO);
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .where('board.id = :id', { id: createBoardCommentDTO.boardId })
      .getOne()
      .then((board) => {
        const boardComment = new BoardComment();
        boardComment.comment = createBoardCommentDTO.comment;
        boardComment.board = board;
        boardComment.createBy = user;
        console.log(boardComment);
        return this.boardCommentRepository.save(boardComment);
      })
      .catch((e) => {
        throw e;
      });

    console.log(result);

    return result;
  }

  async updateBoardComment(
    updateBoardCommentDTO: UpdateBoardCommentDTO,
    user: User,
  ): Promise<BoardComment> {
    console.log(updateBoardCommentDTO);
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .where('board.id = :id', { id: updateBoardCommentDTO.boardId })
      .getOne()
      .then((board) => {
        return this.boardCommentRepository
          .createQueryBuilder('boardComment')
          .where(
            'boardComment.boardId = :boardId and boardComment.id = :boardCommentId',
            {
              boardId: board.id,
              boardCommentId: updateBoardCommentDTO.boardCommentId,
            },
          )
          .getOne()
          .then((boardComment) => {
            boardComment.comment = updateBoardCommentDTO.comment;
            boardComment.modifyAt = new Date().toISOString();
            boardComment.modifyBy = user.id;
            console.log(boardComment);
            return this.boardCommentRepository.save(boardComment);
          });
      })
      .catch((e) => {
        throw e;
      });

    console.log(result);

    return result;
  }

  async getAllBoard(): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.leftJoinAndSelect('board.createBy', 'user');
    query.orderBy('board.id', 'DESC');
    const boards = await query.getMany();
    return boards;
    // query.where('board.userId=:userId', { userId: user.id });
    // const boards = await query.getMany();
    // return boards;
    // return await this.boardRepository.find();
  }

  async getPagingBoard(query: PaginateQuery): Promise<Paginated<Board>> {
    return paginate(query, this.boardRepository, {
      sortableColumns: ['id', 'title'],
      searchableColumns: ['title', 'content'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['createBy'],
    });
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne({ where: { id: id } });
    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }

  async plusViewCnt(board: Board): Promise<Board> {
    board.viewCnt = board.viewCnt + 1;
    return this.boardRepository.save(board);
  }

  async updateBoard(updateBoardDTO: UpdateBoardDTO, user: User) {
    const board = await this.getBoardById(updateBoardDTO.id).then((b) => {
      if (b.createBy.userId === user.userId) {
        b.title = updateBoardDTO.title;
        b.content = updateBoardDTO.content;
        return this.boardRepository.save(b);
      }
      return null;
    });

    if (!board) {
      throw new UnauthorizedException();
    }

    return board;
  }

  async deleteBoard(id: number, user: User) {
    const board = await this.getBoardById(id).then((b) => {
      if (b.createBy.userId === user.userId) {
        return this.boardRepository.delete(id);
      }
      return null;
    });

    if (!board) {
      throw new UnauthorizedException();
    }

    return board;
  }


  async deleteBoardComment(boardCommentId:number, user:User){
    const boardComment = await this.boardCommentRepository.createQueryBuilder('boardComment').where('boardComment.id = :boardCommentId',{boardCommentId}).getOne().then(boardComment => {
      if(boardComment.id === user.id){
        return this.boardCommentRepository.delete(boardComment.id);
      }
      return null;
        
    })

    if(!boardComment){
      throw new UnauthorizedException();
    }
    return boardComment;
  }
}
