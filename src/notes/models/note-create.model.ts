import { Transform } from 'class-transformer';
import {
  IsDate,
  Length,
  Matches,
  MaxLength,
  MinDate,
  isISO8601,
} from 'class-validator';

import { IsNullable, IsTrimmedString } from 'common/class-validator';
import { TEXT_REG_EXP, TITLE_REG_EXP } from 'common/constants';

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TEXT_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_TITLE_LENGTH,
} from '../notes.constants';

export class NoteCreateModel {
  @IsTrimmedString()
  @Matches(TITLE_REG_EXP)
  @Length(MIN_TITLE_LENGTH, MAX_TITLE_LENGTH)
  public readonly title!: string;

  @IsNullable()
  @IsTrimmedString()
  @Matches(TITLE_REG_EXP)
  @Length(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)
  public readonly description!: string | null;

  @IsDate()
  @MinDate(() => new Date())
  @Transform(
    ({ value }: { value: unknown }) => (isISO8601(value) ? new Date(value as string) : value),
    { toClassOnly: true },
  )
  public readonly expirationDate!: Date;

  @IsTrimmedString()
  @Matches(TEXT_REG_EXP)
  @MaxLength(MAX_TEXT_LENGTH)
  public readonly text!: string;
}
