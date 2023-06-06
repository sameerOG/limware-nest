export class ReferencesListResponseDto {
  readonly _id: string;
  readonly name: string;
  readonly city?: string;

  constructor(patient: ReferencesListResponseDto) {
    (this._id = patient._id),
      (this.name = patient.name),
      (this.city = patient.city);
  }
}

export class ReferencesCreateResponseDto {
  readonly _id: string;
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly created_at: number;
  readonly email: string;
  readonly mobile_number: string;
  readonly updated_at: number;

  constructor(reference: ReferencesCreateResponseDto) {
    (this._id = reference._id),
      (this.address = reference.address),
      (this.city = reference.city),
      (this.created_at = reference.created_at),
      (this.updated_at = reference.updated_at),
      (this.email = reference.email),
      (this.mobile_number = reference.mobile_number),
      (this.name = reference.name);
  }
}
