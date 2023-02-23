import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { ID } from '@/shared/interfaces/types';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

export const GetUserGql = createParamDecorator(
  (field, context: ExecutionContext) => {
    const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
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
  },
);
