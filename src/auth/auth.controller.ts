import {
  Body,
  Controller,
  Get,
  Logger, Post,
  Req, Res, UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/response";
import { User } from "src/user/entities/users.entity";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

const logger = new Logger();
@ApiTags("권한 API")
@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req,@Body() userInfo:LoginUserDto) {
    return this.authService.login(req.user as User);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  @Post("/logout")
  async logout(
    @Req() req,
    @Res() res
  ){
    return new CustomResponse<any>(res).OK(this.authService.logout(req.user as User));
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req) {
    logger.log('profile req : ',req)
    return req.user;
  }



}
