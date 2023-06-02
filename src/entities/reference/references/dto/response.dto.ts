export class ReferencesListResponseDto {
  readonly _id: string;
  readonly name: string;

  constructor(patient: ReferencesListResponseDto) {
    (this._id = patient._id), (this.name = patient.name);
  }
}
