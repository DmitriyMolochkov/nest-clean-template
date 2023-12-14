import { IsString } from 'class-validator';

import { IsPort } from 'common/classValidator';

export class RedisConfigDto {
  @IsString()
  public readonly host!: string;

  @IsPort()
  public readonly port!: number;
}
