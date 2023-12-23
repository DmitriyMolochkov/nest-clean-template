import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import _ from 'lodash';

import { IsTrimmedString } from 'common/class-validator';
import { BaseQuery } from 'common/models';

import { NoteStatus } from '../enums';

export class NoteQuery extends BaseQuery {
  @IsOptional()
  @IsTrimmedString()
  public readonly searchString?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(NoteStatus, {
    each: true,
  })
  @Expose({ name: 'status' })
  @Transform(({ value }: { value: NoteStatus | NoteStatus[] }) => _.castArray(value))
  public readonly statuses?: NoteStatus[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly endDate?: Date;
}
