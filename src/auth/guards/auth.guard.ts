import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { extractTokenFromHeader } from '../utils';

export abstract class AuthGuard {
  abstract canActivate(context: ExecutionContext): Promise<boolean>;

  protected extractTokenFromHeader(request: Request): string | undefined {
    return extractTokenFromHeader(request);
  }
}
