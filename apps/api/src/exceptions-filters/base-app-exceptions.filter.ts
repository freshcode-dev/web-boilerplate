import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { IErrorResponse } from '@boilerplate/shared';

export default abstract class BaseAppExceptionsFilter implements ExceptionFilter {
  private static readonly logger = new Logger('ExceptionsHandler');

  protected defaultErrorMessage = 'Something went wrong';
  protected defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  public catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = exception instanceof HttpException
      ? exception.getStatus()
      : this.defaultStatusCode;

    let message = '';
    let description = '';
    let exceptionDetails: {error: string, message: string} = {message: '', error: ''};

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as { message: string, error: string};
      const messageFromResponse = errorResponse['message'];
      description = errorResponse['error'];

      if (messageFromResponse)
        message = messageFromResponse;
      else
        exceptionDetails = errorResponse;
    } else {
      message = typeof exception === 'string' ? exception : exception.message;

      BaseAppExceptionsFilter.logger.error(exception);
    }

    const responseBody: IErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      message: message || this.defaultErrorMessage,
      description,
      exceptionDetails,
      path: request.url,
      fieldsErrors: this.getFieldsErrors ? this.getFieldsErrors(exception) : undefined
    };

    response.status(statusCode).json(responseBody);
  }


  protected getFieldsErrors?(exception: Error): Record<string, string[]> | undefined;
}
