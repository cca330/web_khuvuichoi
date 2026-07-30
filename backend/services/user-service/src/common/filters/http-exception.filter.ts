import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Xử lý riêng lỗi rate limit (429)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      if (status === HttpStatus.TOO_MANY_REQUESTS) {
        return response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: 'Too Many Requests',
          message: 'Bạn đã thao tác quá nhanh. Vui lòng chờ vài giây rồi thử lại.',
        });
      }

      // Xử lý các lỗi HttpException khác
      const exceptionResponse = exception.getResponse();

      let message: string | string[] = exception.message;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message ?? exception.message;
      }

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }

    // Xử lý các lỗi không phải HttpException
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    });
  }
}
