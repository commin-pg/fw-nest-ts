import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { _createAccessToken, _createRefreshToken } from './auth.util';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginSuccessInfo } from './dto/login.success.info';
import { User } from './entity/user.entity';
import * as config from 'config';
import { PasswordChangeDTO } from './dto/password-change.dto';

const jwtConfig = config.get('jwt');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

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


  async validateUser(userId: string, pass: string): Promise<any> {
    console.log("validateUser : ", userId, pass)
    const query = this.userRepository.createQueryBuilder('user');
    const user = await query
      .select([
        'user.id as id',
        'user.username as username',
        'user.userId as userId',
        'user.password as password',
      ])
      .where('user.userId = :userId', { userId })
      .getRawOne();

    console.log("validate :: ", user)

    if (user) {
      const ss = await bcrypt.compare(pass, user.password);
      if (ss) {
        const { password, ...result } = user;
        return result;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async login(userData: any): Promise<LoginSuccessInfo> {
    // 유저 토큰 생성
    const payload = { id: userData.id, userId: userData.userid, username: userData.username };
    console.log("loginPayload", payload)
    const accessToken = await _createAccessToken(this.jwtService, payload);
    const refPayload = { userId: userData.userid };
    const refreshToken = await _createRefreshToken(
      this.jwtService,
      refPayload,
    );

    const result: LoginSuccessInfo = {
      accessToken: undefined,
      refreshToken: undefined,
      userData: payload
    };

    result.accessToken = accessToken;
    result.refreshToken = refreshToken;

    return result;
  }

  async changePassword(user: User, passwordChange: PasswordChangeDTO) {
    const { userId, oldPassword, newPassword } = passwordChange;

    if (user.userId !== userId) {
      throw new UnauthorizedException('Id가 다릅니다.')
    }

    const salt = await bcrypt.genSalt();
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    return this.validateUser(userId, oldPassword).then(result => {
      console.log(result);
      if (result) {
        return this.userRepository.findOneBy({ id: result.id }).then(newUser => {

          newUser.password = newHashedPassword
          console.log("newUser", newUser);
          return this.userRepository.save(newUser);
        })
      } else {
        throw new UnauthorizedException('password가 다릅니다.')
      }
    }).catch(e => {
      throw e;
    })
  }

  async verify(token) {
    try {
      const result = this.jwtService.verify(token, { secret: jwtConfig.secret })
      console.log("Verify! ", result)
      return result;
    } catch (e) {
      console.log(e);
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'EXPIRED_TOKEN':
        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }

}
