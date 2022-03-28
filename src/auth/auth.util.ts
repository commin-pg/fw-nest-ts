import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import * as config from 'config';

const jwtConfig = config.get('jwt');

export async function _createAccessToken(
    jwtService: JwtService,
    payload: any,
  ) {
    return jwtService.sign(
       payload
    );
  }

export async function _createRefreshToken(
  jwtService: JwtService,
  payload: any,
) {
  return jwtService.sign(
     payload,
    {
      secret: jwtConfig.refresh_secret,
      expiresIn: jwtConfig.refresh_expiresIn,
    },
  );
}
