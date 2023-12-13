import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { IUser } from 'common/contracts';

import { AuthService } from './auth.service';
import { AuthUser } from './authUser.decorator';
import { LoginDto } from './dto';
import { AccessGuard, RefreshGuard } from './guards';
import { extractTokenFromHeader } from './utils';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  public constructor(private readonly authService: AuthService) {}
  @Post('login')
  public async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @Post('logout')
  public async logout(@AuthUser() user: IUser) {
    await this.authService.logout(user);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  public refresh(@AuthUser() user: IUser, @Req() req: Request) {
    const refreshToken = extractTokenFromHeader(req);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    return this.authService.refreshTokens(user, refreshToken);
  }
}
