export class Error {
  readonly field: string;
  readonly message: string;

  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }
}
