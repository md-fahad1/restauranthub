import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Only use this AFTER TenantGuard has run (it validates access and sets req.tenantId).
 * Usage inside a resolver:
 *   myQuery(@TenantId() restaurantId: string) { ... }
 */
export const TenantId = createParamDecorator((data: unknown, context: ExecutionContext): string => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.tenantId;
});
