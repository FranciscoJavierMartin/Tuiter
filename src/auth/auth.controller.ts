import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '@/auth/services/auth.service';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';

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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created',
    type: ResponseRegisterDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Error on internal request',
  })
  public async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(new ParseFilePipe({})) avatarImage: Express.Multer.File,
  ): Promise<ResponseRegisterDto> {
    return this.authService.create(registerDto, avatarImage);
  }
}
