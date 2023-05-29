export class Invoice {
  readonly appointment_id: string;
  readonly created_at: number;
  readonly created_by: string;
  readonly description: string;
  readonly discount_amount: number;
  readonly due_amount: number;
  readonly facility_id: string;
  readonly invoice_date: number;
  readonly invoice_number: number;
  readonly paid_amount: number;
  readonly patient_account_id: string;
  readonly patient_id: string;
  readonly status: number;
  readonly title: string;
  readonly total_amount: number;
  readonly total_payable_amount: number;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly _id: string;

  constructor(invoice: Invoice) {
    (this.appointment_id = invoice.appointment_id),
      (this.created_by = invoice.created_by),
      (this.description = invoice.description),
      (this.discount_amount = invoice.discount_amount),
      (this.due_amount = invoice.due_amount),
      (this.facility_id = invoice.facility_id),
      (this.invoice_date = invoice.invoice_date),
      (this.invoice_number = invoice.invoice_number),
      (this.paid_amount = invoice.paid_amount),
      (this.patient_account_id = invoice.patient_account_id),
      (this.patient_id = invoice.patient_id),
      (this.status = invoice.status),
      (this.title = invoice.title),
      (this.total_amount = invoice.total_amount),
      (this.total_payable_amount = invoice.total_payable_amount),
      (this.updated_at = invoice.updated_at),
      (this.updated_by = invoice.updated_by),
      (this._id = invoice._id),
      (this.created_at = invoice.created_at);
  }
}

export class InvoiceLineItems {
  readonly amount: number;
  readonly created_at: number;
  readonly created_by: string;
  readonly facility_id: string;
  readonly invoice_id: string;
  readonly remarks: string;
  readonly test_id: string;
  readonly title: string;
  readonly updated_at: number;
  readonly updated_by: string;
  readonly _id: string;

  constructor(invLineItems: InvoiceLineItems) {
    (this.amount = invLineItems.amount),
      (this.created_by = invLineItems.created_by),
      (this.invoice_id = invLineItems.invoice_id),
      (this.remarks = invLineItems.remarks),
      (this.test_id = invLineItems.test_id),
      (this.facility_id = invLineItems.facility_id),
      (this._id = invLineItems._id),
      (this.title = invLineItems.title),
      (this.updated_at = invLineItems.updated_at),
      (this.updated_by = invLineItems.updated_by),
      (this.created_at = invLineItems.created_at);
  }
}

export class InvoiceLineItemsResponseDto {
  readonly invoice: Invoice;
  readonly invoiceLineItems: InvoiceLineItems[];

  constructor(invLineItems: InvoiceLineItemsResponseDto) {
    (this.invoice = invLineItems.invoice),
      (this.invoiceLineItems = invLineItems.invoiceLineItems);
  }
}
