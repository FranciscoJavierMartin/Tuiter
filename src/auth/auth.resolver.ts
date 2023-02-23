import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserDto } from '@/user/dto/responses/user.dto';
import { AuthService } from '@/auth/services/auth.service';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';
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

  @Mutation(() => String, {
    name: 'forgotPassword',
    description: 'Send reset password email',
  })
  public async forgotPassword(): Promise<string> {
    return 'Hello';
  }
}
