import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * Usage inside a resolver:
 *   someMutation(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): JwtPayload => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.user;
});
