import { IsInt, IsString } from "class-validator";

export class RedisConfigDto {
  @IsString()
  public readonly host!: string;

  @IsInt()
  public readonly port!: number;
}
