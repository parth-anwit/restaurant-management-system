import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new UnauthorizedException();
  }

  return request.user;
});
