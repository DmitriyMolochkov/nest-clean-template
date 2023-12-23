import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class UnauthorizedExceptionFilter
implements ExceptionFilter<UnauthorizedException> {
  public catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { message } = exception;

    if (request.originalUrl.includes('/bull')) {
      response.redirect('auth');
    } else {
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
