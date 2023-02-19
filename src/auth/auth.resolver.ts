import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from '@/auth/services/auth.service';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { RegisterDto } from '@/auth/dto/requests/register.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => ResponseRegisterDto, {
    name: 'login',
    description: 'Login created user',
  })
  public async login(@Args() loginDto: LoginDto): Promise<ResponseRegisterDto> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => String, {
    name: 'register',
    description: 'Register new user',
  })
  public async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<string> {
    console.log(registerDto);
    return 'Registered';
  }
}
