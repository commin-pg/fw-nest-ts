import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/users.entity";
import * as bcrypt from "bcrypt";
import { bcryptConstant } from "src/constants/constants";
import { ERROR_CODE } from "src/constants/message.constants";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto): Promise<any> {
    const isExist = await this.userRepository.findOne({
      userId: createUserDto.userId,
    });
    if (isExist) {
      throw new ForbiddenException({
        statusCode: ERROR_CODE.JOIN_FAIL.CODE,
      });
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      bcryptConstant.saltOrRounds
    );

    const { password, ...result } = await this.userRepository.save(
      createUserDto
    );
    return result;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ["seq", "userId", "userName", "role"],
    });
  }

  public async findOneByUserId(userId: string): Promise<User | undefined> {
    return this.userRepository.findOne(
      { userId: userId },
      {
        select: [
          "seq",
          "userId",
          "userName",
          "role",
          "currentHashedRefreshToken",
        ],
      }
    );
  }


  
  public async findOneByUserSeq(seq: number): Promise<User | undefined> {
    return this.userRepository.findOne(
     seq
    );
  }

  public async checkUserId(userId: string): Promise<User | undefined> {
    const isExist = await this.userRepository.findOne(
      {
        userId: userId,
      },
      { select: ["userId"] }
    );
    return isExist;
  }

  public async updateRefreshBySeq(
    seq: number,
    refresh: string
  ): Promise<User | undefined> {
    const userNew = await this.userRepository.findOne({ seq: seq });
    userNew.currentHashedRefreshToken = refresh;
    return await this.userRepository.save(userNew);
  }
}
