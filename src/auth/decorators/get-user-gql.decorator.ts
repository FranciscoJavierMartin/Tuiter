import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUserGql = createParamDecorator(
  (field, context: ExecutionContext) => {
    const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const user = req.user;
    console.log('Decorator', user);
    return 'Hello';
  },
);
