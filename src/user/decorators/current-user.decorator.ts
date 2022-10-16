import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface User {
  email: string;
  id: string;
}

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
