import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUserFromRequest } from '@/helpers/utils';

// Get user (or user field) from JWT
export const GetUser = createParamDecorator((field, ctx: ExecutionContext) =>
  getCurrentUserFromRequest(ctx.switchToHttp().getRequest()?.user, field),
);
