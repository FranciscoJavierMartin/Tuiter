import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getCurrentUserFromRequest } from '@/helpers/request-utils';

// Get user (or user field) from JWT
// TODO: Move to shared/decorators/graphql
export const GetUserGql = createParamDecorator(
  (field, context: ExecutionContext) =>
    getCurrentUserFromRequest(
      GqlExecutionContext.create(context).getContext().req?.user,
      field,
    ),
);
