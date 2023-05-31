export class GetAllTestsResponseDto {
  readonly code: number;
  readonly name: string;
  readonly _id: string;

  constructor(test: GetAllTestsResponseDto) {
    (this.code = test.code), (this._id = test._id), (this.name = test.name);
  }
}

export class RateListResponseDto {
  readonly name: string;
  readonly status: number;
  readonly _id: string;

  constructor(test: RateListResponseDto) {
    (this.name = test.name), (this._id = test._id), (this.status = test.status);
  }
}

export class RateListCreateResponseDto {
  readonly name: string;
  readonly status: number;
  readonly _id: string;
  readonly created_at: number;
  readonly facility_id: string;
  readonly updated_at: number;

  constructor(rateList: RateListCreateResponseDto) {
    (this.name = rateList.name),
      (this.facility_id = rateList.facility_id),
      (this.created_at = rateList.created_at),
      (this.updated_at = rateList.updated_at),
      (this._id = rateList._id),
      (this.status = rateList.status);
  }
}
