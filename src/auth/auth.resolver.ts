import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Ip } from '@/shared/decorators/graphql/ip.decorator';
import { UserDto } from '@/user/dto/responses/user.dto';
import { AuthService } from '@/auth/services/auth.service';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ForgotPasswordDto } from '@/auth/dto/requests/forgot-password.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';
import { InfoMessageDto } from '@/auth/dto/responses/info-message.dto';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { GetUserGql } from '@/auth/decorators/get-user-gql.decorator';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => ResponseRegisterDto, {
    name: 'login',
    description: 'Login created user',
  })
  public async login(
    @Args('loginInput') loginDto: LoginDto,
  ): Promise<ResponseRegisterDto> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => ResponseRegisterDto, {
    name: 'register',
    description: 'Register new user',
  })
  public async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<ResponseRegisterDto> {
    return this.authService.create(registerDto);
  }

  @Query(() => UserDto, {
    name: 'currentUser',
    description: 'Get current user info',
  })
  @UseGuards(GqlAuthGuard)
  public async getCurrentUser(
    @GetUserGql() user: CurrentUser,
  ): Promise<UserDto> {
    const userFromServer = await this.authService.getUser(user.userId);
    return new UserDto(userFromServer);
  }

  @Mutation(() => InfoMessageDto, {
    name: 'forgotPassword',
    description: 'Send reset password email',
  })
  public async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<InfoMessageDto> {
    await this.authService.sendForgotPasswordEmail(forgotPasswordDto.email);
    return {
      message: 'Password reset email sent',
    };
  }

  @Mutation(() => InfoMessageDto, {
    name: 'resetPassword',
    description: 'Change user password and send an email to user',
  })
  public async resetPassword(
    @Args('token') token: string,
    @Ip() ip: string,
  ): Promise<InfoMessageDto> {
    console.log(token);
    return {
      message: 'Password reset email sent',
    };
  }
}
