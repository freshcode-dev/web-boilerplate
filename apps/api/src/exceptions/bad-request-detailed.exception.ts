import { BadRequestException } from '@nestjs/common';
import IExceptionWithFieldsErrors from './interfaces/exception-with-fields-errors';

export default class BadRequestDetailedException extends BadRequestException implements IExceptionWithFieldsErrors {
  constructor(message?: string, public fieldsErrors?: Record<string, string[]>) {
    super(message);
  }
}
