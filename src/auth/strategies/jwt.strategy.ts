import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as config from "config";

const jwtConfig = config.get("jwt");
const logger = new Logger();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    logger.log("JwtStrategy : ", ExtractJwt.fromAuthHeaderAsBearerToken());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // 만료검증은 서버에서 = true
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    logger.log("JWT VALIDATE : ", payload);
    return {
      userId: payload.userId,
      userName: payload.userName,
      seq: payload.seq,
      role: payload.role,
    };
  }
}
