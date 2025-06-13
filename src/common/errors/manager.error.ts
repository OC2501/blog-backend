import { HttpException, HttpStatus } from '@nestjs/common';

export class ManagerError extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type} :: ${message}`);
  }

  static createSignatureError(message: string) {
    const name = message.split(' :: ')[0];
    const description = message.split(' :: ')[1];

    const statusCode = HttpStatus[name] !== undefined ? HttpStatus[name] : HttpStatus.INTERNAL_SERVER_ERROR;

    if (name) {
      throw new HttpException(
        {
          error: name,
          statusCode: statusCode,
          message: description,
        },
        statusCode,
        {
          cause: new Error(message),
        },
      );
    }

    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}