import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/users.entity";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "src/user/user.service";

const logger = new Logger();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    logger.log("AuthService validateUser : ", loginUserDto);

    // const user = await this.userService
    //   .findOneByUserId(loginUserDto.userId)
    //   .then((respon) => {
    //     console.log(respon);
    //     return respon;
    //   });
    const user = await this.userRepository.findOne({
      userId: loginUserDto.userId,
    });

    if (!user) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`등록되지 않은 사용자입니다.`],
        error: "Forbidden",
      });
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`사용자 정보가 일치하지 않습니다.`],
        error: "Forbidden",
      });
    }
  }

  async login(user: any) {
    const payload = {
      userId: user.userId,
      userName: user.userName,
      seq: user.seq,
      role: user.role,
    };

    console.log("service login : ", payload);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        { userId: payload.userId },
        {
          secret: "refreshToken!",
          expiresIn: 600000,
        }
      ),
      userInfo: payload,
    };
  }
}
