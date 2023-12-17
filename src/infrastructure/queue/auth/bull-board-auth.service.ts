import { Inject, Injectable } from '@nestjs/common';

import { BULL_CONFIG } from 'common/constants';
import { BullBoardConfig } from 'infrastructure/config';

@Injectable()
export class BullBoardAuthService {
  public constructor(
    @Inject(BULL_CONFIG) private readonly config: BullBoardConfig,
  ) {}

  public validate(username: string, password: string): boolean {
    if (username === this.config.username && password === this.config.password) {
      return true;
    }

    return false;
  }
}
