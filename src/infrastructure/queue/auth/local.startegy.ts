import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { BullBoardAuthService } from "./bullBoardAuth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: BullBoardAuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<{ username: string }> {
    const isValid = await this.authService.validate(username, password);

    if (!isValid) {
      throw new UnauthorizedException();
    }
    return { username };
  }
}
