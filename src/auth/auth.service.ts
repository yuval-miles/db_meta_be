import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, password } = dto;
    try {
      const foundEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (foundEmail) {
        throw new BadRequestException('Email already exists');
      }

      const hash = await this.hashPassword(password);
      await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });
    } catch (err) {
      throw err;
    }

    return { message: 'signup was successful' };
  }

  async signIn(dto: AuthDto, res: Response) {
    const { email, password } = dto;
    let foundUser;
    try {
      foundUser = await this.prisma.user.findUnique({
        where: { email },
      });
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }

    if (!foundUser) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.hash,
    });
    if (!isMatch) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });
    if (!token) {
      throw new ForbiddenException();
    }
    res.cookie('token', token, {
      httpOnly: this.config.get('NODE_ENV') === 'development' ? false : true,
      secure: this.config.get('NODE_ENV') === 'development' ? false : true,
      sameSite: this.config.get('NODE_ENV') === 'development' ? 'lax' : 'none',
    });
    return res.send({ message: 'Logged in successfully' });
  }

  async signOut(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async getAuth(req: Request) {
    if (req.cookies && 'token' in req.cookies) {
      const payload = this.jwt.decode(req.cookies.token);
      if (typeof payload === 'object') {
        return { ...payload };
      } else return false;
    }
    return false;
  }

  hashPassword = async (password: string) => {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  };

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, { secret: secret });
  }
}
