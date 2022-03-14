import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
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
import { Response } from "express";

@ApiTags("유저 API")
@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth("accessToken")
  @Role("admin")
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Res() res: Response, @Param("id") id: string): any {
    return this.userService.findOne(id).then((result) => {
      res.status(HttpStatus.OK).json({ data: result });
    });
  }
}
