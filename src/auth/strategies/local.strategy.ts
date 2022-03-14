import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    console.log("localStrategy const")
    super({
      usernameField: "userId",
    });
  }

  async validate(userId: string, password: string): Promise<any> {
    console.log("local guard user : ", userId, password);
    let loginUserDto: LoginUserDto = {
      userId: userId,
      password: password,
    };

    const user = await this.authService.validateUser(loginUserDto);
    console.log("local guard user : ", user);

    if (!user) {
      console.log("local guard no user : ", user);
      throw new UnauthorizedException();
    }
    return user;
  }
}
