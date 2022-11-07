import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ID } from '@/shared/interfaces/types';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

// Get user (or user prop) from JWT
export const GetUser = createParamDecorator((prop, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  let res: string | ID | CurrentUser;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  if (prop === 'userId') {
    res = new ObjectId(user[prop]);
  } else if (prop) {
    res = user[prop];
  } else {
    res = user;
  }

  return res;
});
