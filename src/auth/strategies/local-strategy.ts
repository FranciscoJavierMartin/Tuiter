import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    return true;
  }
}
