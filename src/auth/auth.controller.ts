import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  Get,
  UseGuards,
  Param,
  Ip,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { FILE_SIZE_LIMIT } from '@/shared/contants';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { UserDto } from '@/auth/dto/responses/user.dto';
import { ForgotPasswordDto } from '@/auth/dto/requests/forgot-password.dto';
import { InfoMessageDto } from '@/auth/dto/responses/info-message.dto';
import { ResetPasswordDto } from '@/auth/dto/requests/reset-password.dto';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatarImage', {
      limits: {
        fieldSize: FILE_SIZE_LIMIT,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'User created',
    type: ResponseRegisterDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiBadGatewayResponse({
    description: 'Error on internal request',
  })
  @ApiBody({ type: RegisterDto })
  public async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(new ParseFilePipe({})) avatarImage: Express.Multer.File,
  ): Promise<ResponseRegisterDto> {
    return this.authService.create(registerDto, avatarImage);
  }

  @Get('login')
  @ApiOkResponse({
    description: 'User logged',
    type: ResponseRegisterDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBody({ type: LoginDto })
  public async login(@Body() loginDto: LoginDto): Promise<ResponseRegisterDto> {
    return this.authService.login(loginDto);
  }

  @Get('current-user')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User info',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found in DB',
  })
  @UseGuards(AuthGuard())
  public async getCurrentUser(@GetUser() user: CurrentUser): Promise<UserDto> {
    const userFromServer = await this.authService.getUser(user.userId);
    return new UserDto(userFromServer);
  }

  @Post('forgot-password')
  @ApiCreatedResponse({
    description: 'Send email to reset user password',
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
  })
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<InfoMessageDto> {
    await this.authService.sendForgotPasswordEmail(forgotPasswordDto.email);
    return {
      message: 'Password reset email sent',
    };
  }

  @Post('reset-password/:token')
  @ApiParam({
    name: 'Token',
    description: 'Auto generated token to change validation',
  })
  @ApiCreatedResponse({
    description: 'Change user password and send an email to user',
  })
  @ApiBadRequestResponse({
    description: 'Token has expired',
  })
  public async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Ip() ip: string,
  ): Promise<InfoMessageDto> {
    await this.authService.sendResetPasswordEmail(
      resetPasswordDto.password,
      token,
      ip,
    );
    return {
      message: 'Password reset email sent',
    };
  }
}
