import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
  public async validate(payload: any) {
    return { id: payload.id };
  }
}
