import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './decorator/public.decorator';
import * as config from 'config'
import { AuthService } from './auth.service';
const jwtConfig = config.get('jwt');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private reflector: Reflector
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    // console.log(this.authService)

    const { authorization } = request.headers;

    if (authorization === undefined)
      throw new HttpException("Token이 없습니다.", HttpStatus.UNAUTHORIZED);

    const token = authorization.replace("Bearer ", "");
    return this.authService.verify(token).then(result => {
      console.log("AuthGuard Result User:", result);
      request.user = result;
      return true;
    }).catch(e => {
      console.log("AuthGuard Result User ERRR:", e);
      throw e
    })


    // if(request.user){

    // }else{
    //   throw new HttpException("Token이 없습니다2.", HttpStatus.UNAUTHORIZED);
    // }

    // return true;

    // return super.canActivate(context);
  }
}
