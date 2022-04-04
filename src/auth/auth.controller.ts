import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginSuccessInfo } from './dto/login.success.info';
import { User } from './entity/user.entity';

@Controller('/api/auth')
@ApiTags("인증 API")
export class AuthController {
    constructor(private authService:AuthService){}

    @Public()
    @Post('/join')
    createUser(@Body() user:AuthCredentialDTO):Promise<User>{
        return this.authService.createUser(user);
    }
    
    @Public()
    @Post('/login')
    login(@Body() user:LoginDTO):Promise<LoginSuccessInfo>{
        console.log("login : ",user)
        return this.authService.login(user);
    }

    @ApiBearerAuth('accessToken')
    @Post('/auth')
    auth(@Req() req){
        Logger.log(`Auth Check!`)
        const { authorization } = req.headers;
        const token = authorization.replace("Bearer ", "");
        return this.authService.verify(token)
    }
}
