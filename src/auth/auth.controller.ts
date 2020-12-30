import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res) {
    const cookie = this.authService.getCookieWithJwtToken(req.user);
    res.set('Set-Cookie', cookie);
    res.send({ message: 'Welcome' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    res.set('Set-Cookie', this.authService.getCookieForLogout());
    // revoke/blacklist cookie here?
    // res.sendStatus(204);
    res.status(200);
    res.send({ message: 'Logged out' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  user(@Request() req) {
    return req.user;
  }
}
