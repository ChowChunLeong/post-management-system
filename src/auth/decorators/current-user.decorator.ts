import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../auth-user.interface';

export const CurrentUser = createParamDecorator(
  <T = AuthUser>(data: keyof T | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    const user: T = request.user;

    return data ? user?.[data] : user;
  },
);
