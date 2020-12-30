import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOne(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      // const { password, ...result } = user;
      // return result;
      return { email: user.email };
    }

    return null;
  }

  getCookieWithJwtToken(user: any): string {
    const jwt = this.jwtService.sign({
      email: user.email,
      // sub: user.userId,
    });
    const maxAge = jwtConstants.cookieExpirationTime;

    return process.env.ENV === 'dev'
      ? `auth=${jwt};Path=/;Max-Age=${maxAge};HttpOnly`
      : `auth=${jwt};Path=/;Max-Age=${maxAge};HttpOnly;Domain=.${process.env.DOMAIN};Secure;SameSite=None`;
  }

  getCookieForLogout(): string {
    return process.env.ENV === 'dev'
      ? 'auth=;Path=/;Max-Age=0;HttpOnly'
      : `auth=;Path=/;Max-Age=0;HttpOnly;Domain=.${process.env.DOMAIN};Secure;SameSite=None`;
  }
}
