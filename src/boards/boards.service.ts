import { Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { QueryTypeFactory } from '@nestjs/graphql/dist/schema-builder/factories/query-type.factory';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { userInfo } from 'os';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { BoardStatus } from './board.enum';
import { UpdateBoardDTO } from './dto/update-board.dto';
import { Board } from './entity/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
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

  async getAllBoard(): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.leftJoinAndSelect('board.createBy','user')
    query.orderBy('board.id',"DESC")
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

  async plusViewCnt(board:Board): Promise<Board>{
      board.viewCnt = board.viewCnt+1
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

  async deleteBoard(id: number,user:User) {
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
}
