import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Strategy } from 'passport-jwt';

import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: jwtConfig.secret,
      ignoreExpiration: true, // 만료검증은 서버에서
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    const { userId } = payload;
    const result: User = await this.userRepository.findOne({
      where: { userId },
    });

    if (!result) {
      throw new UnauthorizedException();
    }

    const user = {
      id: result.id,
      userId: result.userId,
      username: result.username,
    };

    console.log('JWT STRATEGY :' , user)

    return user;
  }
}
