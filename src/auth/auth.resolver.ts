import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from '@/auth/services/auth.service';
import { LoginDto } from '@/auth/dto/requests/login.dto';
import { ResponseRegisterDto } from '@/auth/dto/responses/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => ResponseRegisterDto, { name: 'login' })
  public async login(@Args() loginDto: LoginDto): Promise<ResponseRegisterDto> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => String, { name: 'register' })
  public async register(): Promise<string> {
    return 'Register';
  }
}
