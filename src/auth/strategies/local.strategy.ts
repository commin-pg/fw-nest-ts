import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import { Strategy } from "passport-local";

const logger = new Logger();
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    logger.log("localStrategy const", authService);
    super({
      usernameField: "userId",
    });
  }

  async validate(userId: string, password: string): Promise<any> {
    logger.log("local guard user : ", userId, password);
    let loginUserDto: LoginUserDto = {
      userId: userId,
      password: password,
    };

    const user = await this.authService.validateUser(loginUserDto);
    logger.log("local guard user : ", user);

    if (!user) {
      logger.log("local guard no user : ", user);
      throw new UnauthorizedException({
        statusCode: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        message: [`사용자 정보가 일치하지 않습니다.`],
        error: "Unauthorized",
      });
    }
    return user;
  }
}
