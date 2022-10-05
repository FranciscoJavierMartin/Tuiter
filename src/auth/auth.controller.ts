import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/requests/register.dto';
import { ResponseRegisterDto } from './dto/responses/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatarImage', {
      limits: {
        fieldSize: 50,
      },
    }),
  )
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(new ParseFilePipe({})) avatarImage: Express.Multer.File,
  ): Promise<ResponseRegisterDto> {
    return this.authService.create(registerDto, avatarImage);
  }
}
