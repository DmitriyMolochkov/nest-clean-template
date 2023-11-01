import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: unknown, done: (err: Error, user: unknown) => void): void {
    done(null, user);
  }

  deserializeUser(
    payload: string,
    done: (err: Error, payload: string) => void,
  ): void {
    done(null, payload);
  }
}
