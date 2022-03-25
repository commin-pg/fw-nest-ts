import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as config from "config";
import { AuthService } from "src/auth/auth.service";
import { User } from "./entities/users.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const jwtConfig = config.get("jwt");

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService,AuthService],
  exports: [UserService],
})
export class UserModule {}
