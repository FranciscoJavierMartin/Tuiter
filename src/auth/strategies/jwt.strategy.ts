import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt.payload';

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
  public validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
