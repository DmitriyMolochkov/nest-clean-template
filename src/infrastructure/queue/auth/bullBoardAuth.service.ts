import { Inject, Injectable } from '@nestjs/common';

import { BullBoardConfigDto } from 'infrastructure/config';

@Injectable()
export class BullBoardAuthService {
  constructor(
    @Inject('BULL_CONFIG') private readonly config: BullBoardConfigDto,
  ) {}

  validate(username: string, password: string): boolean {
    if (username === this.config.username && password === this.config.password) {
      return true;
    }

    return false;
  }
}
