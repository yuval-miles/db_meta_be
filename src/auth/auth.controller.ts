import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signIn(@Body() dto: AuthDto, @Res() res: Response) {
    return this.authService.signIn(dto, res);
  }

  @Get('signout')
  signOut(@Res() res: Response) {
    return this.authService.signOut(res);
  }

  @Get('')
  async getAuth(@Req() req: Request) {
    return this.authService.getAuth(req);
  }
}
