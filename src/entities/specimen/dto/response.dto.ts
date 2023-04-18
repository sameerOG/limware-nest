export class SpecimenDto {
  readonly _id: string;
  readonly name: string;
  readonly description: string;

  constructor(user: SpecimenDto) {
    (this._id = user._id),
      (this.name = user.name),
      (this.description = user.description);
  }
}

export class SingleSpecimenDto {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly created_at: number;
  readonly updated_at: number;
  readonly updated_by: string;

  constructor(specimen: SingleSpecimenDto) {
    (this._id = specimen._id),
      (this.name = specimen.name),
      (this.updated_at = specimen.updated_at),
      (this.updated_by = specimen.updated_by),
      (this.created_at = specimen.created_at);
  }
}
