import { IsDefined, IsString } from 'class-validator';

export class BullBoardConfigDto {
  @IsDefined()
  @IsString()
  public readonly username!: string;

  @IsDefined()
  @IsString()
  public readonly password!: string;
}
