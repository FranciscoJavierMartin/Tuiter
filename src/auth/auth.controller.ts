import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  UseGuards,
  Param,
  Ip,
  Patch,
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { DefaultImagePipe } from '@/shared/pipes/validate-file.pipe';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';
import { UserDto } from '@/user/dto/responses/user.dto';
import { AuthService } from '@/auth/services/auth.service';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ForgotPasswordDto } from '@/auth/dto/requests/forgot-password.dto';
import { ResetPasswordDto } from '@/auth/dto/requests/reset-password.dto';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { ChangePasswordDto } from '@/auth/dto/requests/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatarImage'))
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
    @UploadedFile(DefaultImagePipe)
    avatarImage?: Express.Multer.File,
  ): Promise<ResponseRegisterDto> {
    return this.authService.create(registerDto, avatarImage);
  }

  @Post('login')
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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
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
    name: 'token',
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

  @Patch('change-password')
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    description: 'Password updated',
  })
  @ApiBadRequestResponse({
    description: 'New password cannot be the same than previous password',
  })
  @ApiBadGatewayResponse({
    description: 'Error sending email',
  })
  @UseGuards(AuthGuard())
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser('username') username: string,
    @Ip() ip: string,
  ): Promise<void> {
    await this.authService.changePassword(
      username,
      changePasswordDto.newPassword,
      ip,
    );
  }
}
