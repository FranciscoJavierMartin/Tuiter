import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUserFromRequest } from '@/helpers/requests-utils';

// Get user (or user field) from JWT
// TODO: Move to shared/decorators
export const GetUser = createParamDecorator((field, ctx: ExecutionContext) =>
  getCurrentUserFromRequest(ctx.switchToHttp().getRequest()?.user, field),
);
