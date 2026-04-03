import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { Response } from 'express';
import { DrizzleQueryError } from 'drizzle-orm';

@Catch(DrizzleQueryError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: DrizzleQueryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const cause = exception.cause;

    if (cause instanceof DatabaseError) {
      this.logger.error(
        `Database Error: ${JSON.stringify(exception, null, 4)}`,
      );

      switch (cause.code) {
        case '23503':
          return response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Resource not found.',
          });

        case '23505':
          return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Resource already exists.',
          });

        default:
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database error.',
          });
      }
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected error.',
    });
  }
}
