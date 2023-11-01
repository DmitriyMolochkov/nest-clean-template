import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from "@nestjs/common";

import { BaseExceptionFilter } from "./baseException.filter";
import { UnauthorizedExceptionFilter } from "./unauthorizedException.filter";

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter<unknown> {
  public constructor(
    private readonly baseExceptionFilter: BaseExceptionFilter,
    private readonly unauthorizedExceptionFilter: UnauthorizedExceptionFilter,
  ) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof UnauthorizedException) {
      this.unauthorizedExceptionFilter.catch(exception, host);
    } else {
      this.baseExceptionFilter.catch(exception, host);
    }
  }
}
