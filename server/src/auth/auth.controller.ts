import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  HttpCode,
  Body,
  Res,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dtos/register.dto';
import { CookieOptions, Response } from 'express';

@Controller('auth')
export class AuthController {
  private cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
  };

  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, this.cookieOptions);
    return req.user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      maxAge: 0,
      ...this.cookieOptions,
    });
    return { message: 'Logout successful' };
  }

  @Public()
  @Get('is-user-exist/:usernameOrEmail')
  async isUserExist(@Param('usernameOrEmail') usernameOrEmail: string) {
    return this.authService.isUserExist(usernameOrEmail);
  }

  @Public()
  @Post('register')
  @HttpCode(201)
  async register(@Body() payload: RegisterDto) {
    await this.authService.register(payload);
  }

  @Get('verify-session')
  @HttpCode(204)
  verifySession() {
    return;
  }
}
