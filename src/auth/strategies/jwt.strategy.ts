import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@/auth/interfaces/jwt.payload';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_TOKEN,
    });
  }

  /**
   * Grab Jwt from client and perform some kind of operation
   * @param {JwtPayload} payload - Jwt from client
   * @returns Something
   */
  public validate(payload: JwtPayload): CurrentUser {
    return payload;
  }
}
