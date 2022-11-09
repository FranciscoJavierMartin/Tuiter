import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ID } from '@/shared/interfaces/types';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

// Get user (or user field) from JWT
export const GetUser = createParamDecorator((field, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  let res: string | ID | CurrentUser;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  if (field === 'userId') {
    res = new ObjectId(user[field]);
  } else if (field) {
    res = user[field];
  } else {
    res = user;
  }

  return res;
});
