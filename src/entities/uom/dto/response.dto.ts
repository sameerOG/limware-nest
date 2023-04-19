export class UomDto {
  readonly _id: string;
  readonly name: string;
  readonly description: string;

  constructor(uom: UomDto) {
    (this._id = uom._id),
      (this.name = uom.name),
      (this.description = uom.description);
  }
}

export class SingleUomDto {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly created_at: number;
  readonly updated_at: number;
  readonly updated_by: string;

  constructor(uom: SingleUomDto) {
    (this._id = uom._id),
      (this.name = uom.name),
      (this.created_at = uom.created_at),
      (this.updated_at = uom.updated_at),
      (this.updated_by = uom.updated_by),
      (this.description = uom.description);
  }
}
