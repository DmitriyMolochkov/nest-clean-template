import {
  IsInt,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RedisConfigDto {
  @IsString()
  public readonly host!: string;

  @IsInt()
  @Min(1)
  @Max(65_535)
  public readonly port!: number;
}
