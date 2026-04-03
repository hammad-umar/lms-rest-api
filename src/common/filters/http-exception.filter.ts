import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodSerializationException } from 'nestjs-zod';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError() as {
        issues: unknown[];
      };

      this.logger.error(
        `Serialization failed: ${exception.message}`,
        zodError.issues,
      );

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Response serialization failed.',
      });

      return;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
