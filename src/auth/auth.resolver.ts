import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Query(() => String)
  public async login(): Promise<string> {
    return 'Hello world from login';
  }
}
