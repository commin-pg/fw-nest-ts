import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginSuccessInfo } from './dto/login.success.info';
import { User } from './entity/user.entity';

@Controller('/api/auth')
@ApiTags("인증 API")
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('/join')
    createUser(@Body() user:AuthCredentialDTO):Promise<User>{
        return this.authService.createUser(user);
    }

    @Post('/login')
    login(@Body() user:LoginDTO):Promise<LoginSuccessInfo>{
        console.log("login : ",user)
        return this.authService.login(user);
    }
}
