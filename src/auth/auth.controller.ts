import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { AuthCredentialDTO } from './dto/auth-credential.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginSuccessInfo } from './dto/login.success.info';
import { PasswordChangeDTO } from './dto/password-change.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from './jwt.auth.guard';
import { LocalAuthGuard } from './local.auth.guard';

@Controller('/api/auth')
@ApiTags("인증 API")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('/join')
    createUser(@Body() user: AuthCredentialDTO): Promise<User> {
        return this.authService.createUser(user);
    }

    @Public()
    @Post('/login')
    @UseGuards(LocalAuthGuard)
    login(@Req() req, @Body() loginData: LoginDTO): Promise<LoginSuccessInfo> {
        console.log("login : ", req.user)
        return this.authService.login(req.user);
    }

    @ApiBearerAuth('accessToken')
    @Post('/auth')
    auth(@Req() req) {
        Logger.log(`Auth Check!`)
        const { authorization } = req.headers;
        const token = authorization.replace("Bearer ", "");
        return this.authService.verify(token)
    }


    @ApiBearerAuth('accessToken')
    @Post('/password')
    changePassword(@Req() req, @Body() passwordChange: PasswordChangeDTO) {
        return this.authService.changePassword(req.user, passwordChange);
    }
}
