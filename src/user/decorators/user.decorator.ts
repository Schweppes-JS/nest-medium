import { IExpressRequest } from '@app/types/expressRequest';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IExpressRequest>();
    if (request.user) {
      if (data) return request.user[data];
      else return request.user;
    } else return null;
  },
);
