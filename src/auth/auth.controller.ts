import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/requests/register.dto';
import { ResponseRegisterDto } from './dto/responses/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseRegisterDto> {
    return this.authService.create(registerDto);
  }
}
