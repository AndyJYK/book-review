import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): Response<any, Record<string, any>> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let message;
    let code = 'HttpException';

    console.log(exception);

    Logger.error(message, (exception as any).stack, `${req.method} ${req.url}`);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        message = exception['response']['message'];
        break;
    }

    return res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message
    });
  }
}
