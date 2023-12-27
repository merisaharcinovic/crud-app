import { Body, Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { UserEntity } from 'src/database/entities/user.entity';
import { cookie_name } from 'src/config/cookie.config';


@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req, @Res({passthrough:true}) res: Response, @Body() authCredentials: AuthCredentialsDto){
        const user: UserEntity = req.user;
        
        const token = this.authService.login(user);
        console.log(token)
        res.cookie(cookie_name, token, { httpOnly: true, secure: true, sameSite: "none" });

        return user;
    }

    @Post('logout')
    logout(@Res() res: Response): void {
      res.clearCookie(cookie_name);
      res.send('Logged out successfully');
    }
}
