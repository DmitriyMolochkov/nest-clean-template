import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { IUser } from 'common/contracts';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as IUser;
  },
);
