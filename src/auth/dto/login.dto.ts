import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly login!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly password!: string;
}
