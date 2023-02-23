import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getCurrentUserFromRequest } from '@/helpers/utils';

// Get user (or user field) from JWT
export const GetUserGql = createParamDecorator(
  (field, context: ExecutionContext) => {
    console.log('Hello decorator', GqlExecutionContext.create(context));
    return getCurrentUserFromRequest(
      GqlExecutionContext.create(context).getContext().req?.user,
      field,
    );
  },
);
