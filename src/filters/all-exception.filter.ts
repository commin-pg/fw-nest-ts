import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.FORBIDDEN;
  
      const message =
        typeof exception.message === 'string'
          ? exception.message
          : exception.message.message;
          
      const errorResponse = {
        _statusCode: status,
        _responseTime: new Date().toISOString(),
        path: request.url,
        message: message || 'Something went wrong',
      };
      Logger.error(
        `${request.method} ${request.url} ${status}`,
        JSON.stringify(errorResponse),
        'AllExceptionsFilter',
        true,
      );
      response.status(status).json(errorResponse);
    }
  }