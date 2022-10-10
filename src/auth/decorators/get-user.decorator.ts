import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

// Get user (or user data) from JWT
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  return !data ? user : [user[data]];
});
