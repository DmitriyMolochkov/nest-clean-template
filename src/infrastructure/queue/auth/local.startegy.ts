import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { BullBoardAuthService } from './bullBoardAuth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: BullBoardAuthService) {
    super();
  }

  validate(
    username: string,
    password: string,
  ): { username: string } {
    const isValid = this.authService.validate(username, password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return { username };
  }
}
