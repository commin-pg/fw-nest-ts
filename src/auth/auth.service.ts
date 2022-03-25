import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/users.entity";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "src/user/user.service";
import * as config from "config";

const jwtConfig = config.get("jwt");

const logger = new Logger();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
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

  async _createToken(user: any): Promise<any> {
    const payload = {
      userId: user.userId,
      userName: user.userName,
      seq: user.seq,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async _createRefreshToken(user: any): Promise<any> {
    return this.jwtService.sign(
      { userId: user.userId },
      {
        secret: jwtConfig.refresh_secret,
        expiresIn: jwtConfig.refresh_expiresIn,
      }
    );
  }

  async login(user: any) {
    const refreshToken = await this._createRefreshToken(user);
    const accessToken = await this._createToken(user);
    user = await this.userService.updateRefreshBySeq(user.seq, refreshToken);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: user,
    };
  }

  async logout(user: User) {
    const result = this.userRepository.update(
      { seq: user.seq, userId: user.userId },
      {
        currentHashedRefreshToken:""
      }
    );
    return result;
  }

  async refreshAccessToken(authorization: string, userId: string) {
    const secretKey = jwtConfig.refresh_secret;
    const refreshToken = authorization.replace("Bearer ", "");
    console.log(refreshToken);
    const verify = this.jwtService.verify(refreshToken, { secret: secretKey });

    // refreshToken 만료 안된경우 accessToken 새로 발급
    if (verify) {
      const user = await this.userService.findOneByUserId(userId);
      console.log("user", user);

      // db에 저장된 토큰과 비교
      if (user.currentHashedRefreshToken == refreshToken) {
        const token = await this._createToken(user); // accessToken
        return {
          token: token,
          isAuth: true,
        };
      }
    }

    return {
      isAuth: false,
    };
  }

  async validateAccessToken(accessToken: string, userId: string) {
    const user = await this.userService.findOneByUserId(userId);

    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        message: [`사용자 정보가 없습니다.`],
        error: "Unauthorized",
      });
    }

    // accessToken 이 만료 됐지만 refreshToken 은 기간중인 경우 Token 갱신
    const token = accessToken.replace("Bearer ", "");
    const decoded = this.jwtService.decode(token);

    // accessToken 기간 체크
    const tokenExp = new Date(decoded["exp"] * 1000);
    const now = new Date();

    // 남은시간 (분)
    const betweenTime = Math.floor(
      (tokenExp.getTime() - now.getTime()) / 1000 / 60
    );

    // 기간 만료된 경우 || 기간 얼마 안남은 경우
    if (betweenTime < 3) {
      // refreshToken 통신 유도
      return {
        userId: user.userId,
        userName: user.userName,
        isAuth: true,
        isRefresh: true,
      };
    }

    return {
      userId: user.userId,
      userName: user.userName,
      isAuth: true,
      isRefresh: false,
    };
  }
}
