import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from 'passport-jwt'
import { jwtConstant } from "src/constants/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
    });
  }

  async validate(payload: any) {
    console.log("JWT VALIDATE : ", payload)
    return { userId: payload.userId, userName: payload.userName, seq: payload.seq, role:payload.role };
  }
}