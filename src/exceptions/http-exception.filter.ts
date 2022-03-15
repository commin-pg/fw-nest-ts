import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("Exception Handler!!! ", exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      resultCode: "RESULT_4000",
      success: false,
      msg: exception.message,
      code: 4000,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

  }
}
