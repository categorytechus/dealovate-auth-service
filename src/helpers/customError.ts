export class CustomError {
  statusCode: number;
  status: string;
  error: string;
  message: string;

  constructor(
    statusCode: number,
    status: string,
    error: string,
    message: string,
  ) {
    this.statusCode = statusCode;
    this.status = status;
    this.error = error;
    this.message = message;
  }
}
