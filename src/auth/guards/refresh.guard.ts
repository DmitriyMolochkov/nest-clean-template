import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JWT_CONFIG } from 'common/constants';
import { IUser } from 'common/contracts';
import { JWTConfigDto } from 'infrastructure/config';

import { AuthGuard } from './auth.guard';

@Injectable()
export class RefreshGuard extends AuthGuard implements CanActivate {
  public constructor(
    @Inject(JWT_CONFIG) private readonly jwtConfig: JWTConfigDto,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      request.user = await this.jwtService.verifyAsync<IUser>(
        token,
        { secret: this.jwtConfig.refresh_secret },
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
