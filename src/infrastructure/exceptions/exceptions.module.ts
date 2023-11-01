import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import {
  BaseExceptionFilter,
  CatchAllExceptionFilter,
  UnauthorizedExceptionFilter,
} from './exceptionFilters';

@Global()
@Module({
  providers: [
    BaseExceptionFilter,
    UnauthorizedExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: CatchAllExceptionFilter,
    },
  ],
})
export class ExceptionsModule {}
