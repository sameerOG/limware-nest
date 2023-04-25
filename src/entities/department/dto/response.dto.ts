export class DepartmentDto {
  readonly _id: string;
  readonly facility_id: string;
  readonly name: string;
  readonly description: string;
  readonly parent: string;
  readonly parent_id: string;
  readonly created_at: number;
  readonly updated_at: number;
  readonly updated_by: string;

  constructor(department: DepartmentDto) {
    (this._id = department._id),
      (this.created_at = department.created_at),
      (this.updated_at = department.updated_at),
      (this.updated_by = department.updated_by),
      (this.name = department.name),
      (this.parent = department.parent),
      (this.parent_id = department.parent_id),
      (this.facility_id = department.facility_id),
      (this.description = department.description);
  }
}
