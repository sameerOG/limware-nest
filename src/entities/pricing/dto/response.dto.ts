export class PricingPlanResponseDto {
  readonly is_published: boolean;
  readonly title: string;
  readonly _id: string;
  readonly discount: number;
  readonly packages: any;
  readonly plan_for: string;
  readonly plan_type: string;
  readonly unit_price: number;
  readonly created_at?: number | Date;
  readonly updated_at?: number | Date;

  constructor(pricingPlan: PricingPlanResponseDto) {
    (this.is_published = pricingPlan.is_published),
      (this.title = pricingPlan.title),
      (this._id = pricingPlan._id),
      (this.discount = pricingPlan.discount),
      (this.packages = pricingPlan.packages),
      (this.plan_for = pricingPlan.plan_for),
      (this.plan_type = pricingPlan.plan_type),
      (this.created_at = pricingPlan.created_at),
      (this.updated_at = pricingPlan.updated_at),
      (this.unit_price = pricingPlan.unit_price);
  }
}
