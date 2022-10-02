import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/requests/register.dto';

@Injectable()
export class AuthService {
  create(createAuthDto: RegisterDto) {
    return 'This action adds a new auth';
  }
}
