import { IsString } from 'class-validator';

import { IsPort } from 'common/class-validator';

export class RedisConfig {
  @IsString()
  public readonly host!: string;

  @IsPort()
  public readonly port!: number;
}
