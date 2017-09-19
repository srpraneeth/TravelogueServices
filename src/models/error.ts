export class FieldError {
  field: string;
  error: string;

  constructor(field: string, error: string) {
    this.field = field;
    this.error = error;
  }
}

export class Error {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
