export class GetAllTestsResponseDto {
  readonly code: number;
  readonly name: string;
  readonly _id: string;

  constructor(test: GetAllTestsResponseDto) {
    (this.code = test.code), (this._id = test._id), (this.name = test.name);
  }
}
