import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { bcryptConstant } from 'src/constants/constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}
    
      async create(createUserDto): Promise<any> {
        const isExist = await this.userRepository.findOne({userId: createUserDto.userId});
        if (isExist) {
          throw new ForbiddenException({
            statusCode: HttpStatus.FORBIDDEN,
            message: [`이미 등록된 사용자입니다.`],
            error: 'Forbidden'
          })
        }

        

        createUserDto.password = await bcrypt.hash(createUserDto.password,bcryptConstant.saltOrRounds);
    
        const { password, ...result } = await this.userRepository.save(createUserDto);
        return result;
      }
    
      async findAll(): Promise<User[]> {
        return this.userRepository.find({
          select: ["seq", "userId", "userName", "role"],
        });
      }
    
      findOne(id: string): Promise<User> {
        return this.userRepository.findOne({userId: id}, {
          select: ["seq", "userId", "userName", "role"],
        });
      }
}
