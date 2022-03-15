import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Role } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/users.entity";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { ERROR_CODE, SUCCESS_CODE } from "src/constants/message.constants";
import { LoginUserDto } from "src/auth/dto/login-user.dto";

const logger = new Logger();
@ApiTags("유저 API")
@Controller("api/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    this.userService
      .create(createUserDto)
      .then((result) => {
        if (result) {
          res.status(HttpStatus.OK).json({
            success: true,
            resultCode: SUCCESS_CODE.JOIN_SUCCESS.RESULT_CODE,
            code: SUCCESS_CODE.JOIN_SUCCESS.CODE,
            msg: SUCCESS_CODE.JOIN_SUCCESS.MSG,
            data: result,
          });
        } else {

          res.status(HttpStatus.OK).json({
            success: false,
            resultCode: ERROR_CODE.JOIN_FAIL.RESULT_CODE,
            code: ERROR_CODE.JOIN_FAIL.CODE,
            msg: ERROR_CODE.JOIN_FAIL.MSG,
          });
        }
      })
      .catch((e) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          resultCode: ERROR_CODE.JOIN_FAIL.RESULT_CODE,
          code: ERROR_CODE.JOIN_FAIL.CODE,
          msg: ERROR_CODE.JOIN_FAIL.MSG,
        });
      });
  }

  @ApiBearerAuth("refreshToken")
  // @UseGuards(JwtAuthGuard)
  @Post("/auth/refresh")
  public async authRefresh(
    @Req() req: Request,
    @Body() dto: LoginUserDto,
    @Res() res: Response
  ) {
    const { authorization } = req.headers;

    this.authService
      .refreshAccessToken(authorization, dto.userId)
      .then((result) => {
        res.status(HttpStatus.OK).json({
          success: true,
          resultCode: SUCCESS_CODE.AUTH_SUCCESS.RESULT_CODE,
          code: SUCCESS_CODE.AUTH_SUCCESS.CODE,
          msg: SUCCESS_CODE.AUTH_SUCCESS.MSG,
          data: result,
        });
      })
      .catch((e) => {
        logger.error(e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          resultCode: ERROR_CODE.AUTH_FAIL.RESULT_CODE,
          code: ERROR_CODE.AUTH_FAIL.CODE,
          msg: ERROR_CODE.AUTH_FAIL.MSG,
        });
      });
  }

  @Post("auth")
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  create_user(@Req() req: Request, @Res() res: Response) {
    const { authorization } = req.headers;
    console.log(authorization);
    console.log(req.user);
    // TOKEN 만료 검사
    this.authService
      .validateAccessToken(authorization, req.user["userId"])
      .then((result) => {
        res.status(HttpStatus.OK).json({
          resultCode: SUCCESS_CODE.AUTH_SUCCESS.RESULT_CODE,
          code: SUCCESS_CODE.AUTH_SUCCESS.CODE,
          msg: SUCCESS_CODE.AUTH_SUCCESS.MSG,
          data: result,
        });
      })
      .catch((e) => {
        logger.error(e);
        res.status(HttpStatus.OK).json({
          resultCode: ERROR_CODE.AUTH_FAIL.RESULT_CODE,
          code: ERROR_CODE.AUTH_FAIL.CODE,
          msg: ERROR_CODE.AUTH_FAIL.MSG,
        });
      });
  }

  @ApiBearerAuth("accessToken")
  // @Role(["admin", "normal"])
  // @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(): // @Req() req: Request,
  // @Res() res: Response
  Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":userId")
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard)
  public async findOne(
    @Res() res: Response,
    @Param("userId") userId: string
  ): Promise<any> {
    return this.userService.findOneByUserId(userId).then((result) => {
      res.status(HttpStatus.OK).json({ data: result });
    });
  }
}
