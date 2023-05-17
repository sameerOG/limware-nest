export class AppFeatureResponseDto {
  readonly is_published: boolean;
  readonly title: string;
  readonly _id: string;

  constructor(feature: AppFeatureResponseDto) {
    (this.is_published = feature.is_published),
      (this.title = feature.title),
      (this._id = feature._id);
  }
}

export class SingleAppFeatureResponseDto {
  readonly is_published: boolean;
  readonly title: string;
  readonly _id: string;
  readonly content: string;
  readonly created_at: number;
  readonly updated_at: number;

  constructor(feature: SingleAppFeatureResponseDto) {
    (this.is_published = feature.is_published),
      (this.title = feature.title),
      (this.content = feature.content),
      (this.created_at = feature.created_at),
      (this.updated_at = feature.updated_at),
      (this._id = feature._id);
  }
}
