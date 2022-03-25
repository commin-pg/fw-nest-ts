import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginSuccessInfo } from './dto/login.success.info';
import { User } from './entity/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(user: AuthCredentialDTO) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return await this.userRepository.save({
        username: user.username,
        userId: user.userId,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Exist UserId');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(userData: LoginDTO): Promise<LoginSuccessInfo> {
    const { userId, password } = userData;
    const query = this.userRepository.createQueryBuilder('user');

    console.log(userData)

    const user = await query
      .select([
        'user.id as id',
        'user.username as username',
        'user.userId as userId',
        'user.password as password',
      ])
      .where('user.userId = :userId',{userId})
      .getRawOne();
    console.log('login query result = ', user);

    // const user = await this.userRepository.findOne({
    //   where: { userId: userId },
    // });

    const ss = await bcrypt.compare(password, user.password);
    if (ss) {
      // 유저 토큰 생성
      const payload = { id: user.id, userId: userId };
      const accessToken = await this.jwtService.sign(payload);
      const refPayload = { userId: userId };
      const refreshToken = await this.jwtService.sign(refPayload);

      // const resultUserData:resultUser = {
      //   id:user.id,
      //   userId:user.userId,
      //   username:user.username
      // }
      const { id, username,  } = user;

      const result: LoginSuccessInfo = {
        accessToken: undefined,
        refreshToken: undefined,
        userData: { id, username, userId },
      };

      result.accessToken = accessToken;
      result.refreshToken = refreshToken;

      return result;
    } else {
      throw new UnauthorizedException('login fail');
    }
  }
}
