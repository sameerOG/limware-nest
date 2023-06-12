import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { FileHandling } from 'src/common/file-handling';
import { options } from 'src/common/helper/enums';
import { Invoice } from 'src/entities/invoice/invoice.entity';
import { Laboratory } from 'src/entities/laboratory/laboratory.entity';
import { Patient } from 'src/entities/patient/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Patient) private patientRep: Repository<Patient>,
    @InjectRepository(Invoice) private invoiceRep: Repository<Invoice>,
    @InjectRepository(Laboratory) private labRep: Repository<Laboratory>,
    private fileHandling: FileHandling,
  ) {}

  async getPatientCountReport(body, user): Promise<any> {
    const startDate = new Date(body.start_date);
    const endDate = new Date(body.end_date);
    const facility_id = user.facility_id;

    const patients = await this.patientRep
      .createQueryBuilder('patient')
      .select('patient.*,appointment.lab_number,appointment.is_completed')
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', { facility_id })
      .andWhere('patient.deleted_at IS NULL')
      //   .andWhere(
      //     `patient.created_at BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      //   )
      .orderBy('patient.registration_date', 'DESC')
      .getRawMany();

    let totals = {
      total: patients.length,
      done: 0,
      pending: 0,
      paid: 0,
      partial: 0,
      unpaid: 0,
    };

    for (let i = 0; i < patients.length; i++) {
      let item = patients[i];
      const invoice = await this.invoiceRep
        .createQueryBuilder('invoice')
        .select('invoice.*')
        .where('invoice.patient_id = :patient_id', { patient_id: item._id })
        .getRawOne();

      if (invoice) {
        Object.assign(invoice, { invoice_status: invoice?.status });
      }

      if (item.is_completed) {
        totals.done = totals.done + 1;
      } else {
        totals.pending = totals.pending + 1;
      }
      console.log('status', item.invoice_status);
      if (invoice?.status === 1) {
        totals.unpaid = totals.unpaid + 1;
      } else if (invoice?.status === 2) {
        totals.partial = totals.partial + 1;
      } else if (invoice?.status === 3) {
        totals.paid = totals.paid + 1;
      }
    }

    return {
      dataset: patients,
      totals: totals,
    };
  }

  async printPatientCountReport(body, user): Promise<any> {
    const reportData = await this.getPatientCountReport(body, user);
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    const data = {
      labModel,
      startDate: body.start_date,
      endDate: body.end_date,
      reportDataTotals: reportData,
    };

    const reportTemplate = 'patient_count_report';
    const content = await this.fileHandling.renderTemplate(reportTemplate, {
      data,
    });
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `patient-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  async getPatientDailyCountReport(body, user): Promise<any> {
    const startDate = new Date(body.date);
    const endDate = new Date(body.date);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    const startDateWithoutTime = startDate;
    let endDateWithoutTime = startDate;
    endDateWithoutTime.setDate(endDateWithoutTime.getDate() + 1);
    endDateWithoutTime.setDate(0);

    const endDateWithoutTimeMonth = endDateWithoutTime.getMonth() + 1;
    const endDateWithoutTimeYear = endDateWithoutTime.getFullYear() % 100;

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear() % 100;

    if (month === endDateWithoutTimeMonth && year === endDateWithoutTimeYear) {
      endDateWithoutTime = new Date();
    }

    const startDateStamp = new Date(startDate).getTime() / 1000;
    const endDateStamp = new Date(endDate).getTime() / 1000;

    const patients = await this.patientRep
      .createQueryBuilder('patient')
      .select('patient.*,appointment.lab_number,appointment.is_completed')
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawMany();

    let totals = {
      total: 0,
      done: 0,
      pending: 0,
      paid: 0,
      partial: 0,
      unpaid: 0,
    };
    const dates = await this.fileHandling.getDatesFromRange(
      startDateWithoutTime,
      endDateWithoutTime,
    );
    let filterDates = [];
    for (let i = 0; i < dates.length; i++) {
      let dateItem = this.formatDate(dates[i]);
      let count = patients.filter((item) => {
        return this.formatDate(item.created_at) == dateItem;
      });
      filterDates.push({ date: dateItem, count: count.length });
      for (let j = 0; j < patients.length; j++) {
        let item = patients[j];
        if (this.formatDate(item.created_at) === dateItem) {
          const invoice = await this.invoiceRep
            .createQueryBuilder('invoice')
            .select('invoice.*')
            .where('invoice.patient_id = :patient_id', { patient_id: item._id })
            .getRawOne();
          if (invoice) {
            Object.assign(invoice, { invoice_status: invoice?.status });
          }

          if (item.is_completed) {
            totals.done = totals.done + 1;
          } else {
            totals.pending = totals.pending + 1;
          }
          if (invoice?.status === 1) {
            totals.unpaid = totals.unpaid + 1;
          } else if (invoice?.status === 2) {
            totals.partial = totals.partial + 1;
          } else if (invoice?.status === 3) {
            totals.paid = totals.paid + 1;
          }
          totals.total = totals.total + 1;
        }
      }
    }
    return {
      dataset: filterDates,
      totals,
    };
  }

  async printPatientDailyCountReport(body, user): Promise<any> {
    let reportData = await this.getPatientDailyCountReport(body, user);
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const data = {
      labModel,
      startDate: body.date,
      endDate: body.date,
      reportDataTotals: reportData,
    };

    const reportTemplate = 'patient_count_daily_report';
    const content = await this.fileHandling.renderTemplate(reportTemplate, {
      data,
    });
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `patient-daily-count-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }

  async getSalesReport(body, user): Promise<any> {
    const startDate = new Date(body.start_date).getTime();
    const endDate = new Date(body.end_date).getTime();
    const facility_id = user.facility_id;

    const patients = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient.age,patient.age_unit,patient.gender,patient.mobile_number,patient.name,patient.registration_date,patient.unique_id,patient._id,patient.created_at as registration_date_formatted,appointment.lab_number,appointment.is_completed',
      )
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', { facility_id })
      .andWhere('patient.deleted_at IS NULL')
      //   .andWhere('patient.registration_date >= :start_date', {
      //     start_date: startDate,
      //   })
      //   .andWhere('patient.registration_date <= :end_date', {
      //     end_date: endDate,
      //   })
      .orderBy('patient.registration_date', 'DESC')
      .getRawMany();

    let totals = {
      total_amount: 0,
      paid_amount: 0,
      due_amount: 0,
      discount_amount: 0,
    };

    for (let i = 0; i < patients.length; i++) {
      let item = patients[i];
      const invoice = await this.invoiceRep
        .createQueryBuilder('invoice')
        .select('invoice.*')
        .where('invoice.patient_id = :patient_id', { patient_id: item._id })
        .getRawOne();

      totals.total_amount = invoice
        ? invoice.total_amount + invoice.total_amount
        : 0;
      totals.paid_amount = invoice
        ? totals.paid_amount + invoice.paid_amount
        : totals.paid_amount;
      totals.due_amount = invoice
        ? totals.due_amount + invoice.due_amount
        : totals.due_amount;
      totals.discount_amount = invoice ? invoice.discount_amount : 0;

      let total_amount_ary = await this.fileHandling.separateDecimalValue(
        totals.total_amount,
      );
      let discount_amount_ary = await this.fileHandling.separateDecimalValue(
        totals.discount_amount,
      );
      let due_amount_ary = await this.fileHandling.separateDecimalValue(
        totals.due_amount,
      );
      let paid_amount_ary = await this.fileHandling.separateDecimalValue(
        totals.paid_amount,
      );

      let patient_total_amount_ary =
        await this.fileHandling.separateDecimalValue(
          invoice ? invoice.total_amount : 0,
        );
      let patient_discount_amount_ary =
        await this.fileHandling.separateDecimalValue(
          invoice ? invoice.discount_amount : 0,
        );
      let patient_due_amount_ary = await this.fileHandling.separateDecimalValue(
        invoice ? invoice.due_amount : 0,
      );
      let patient_paid_amount_ary =
        await this.fileHandling.separateDecimalValue(
          invoice ? invoice.paid_amount : 0,
        );
      Object.assign(totals, {
        total_amount_ary,
        discount_amount_ary,
        due_amount_ary,
        paid_amount_ary,
      });
      Object.assign(patients[i], {
        total_amount_ary: patient_total_amount_ary,
        discount_amount_ary: patient_discount_amount_ary,
        due_amount_ary: patient_due_amount_ary,
        paid_amount_ary: patient_paid_amount_ary,
        due_amount: invoice ? invoice.due_amount : 0,
        paid_amount: invoice ? invoice.paid_amount : 0,
        discount_amount: invoice ? invoice.discount_amount : 0,
        total_amount: invoice ? invoice.total_amount : 0,
      });
    }

    return {
      dataset: patients,
      totals: totals,
    };
  }

  async printSalesReport(body, user): Promise<any> {
    let reportData = await this.getSalesReport(body, user);
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();
    const data = {
      labModel,
      startDate: body.start_date,
      endDate: body.end_date,
      reportDataTotals: reportData,
    };
    const reportTemplate = 'sales_report';
    const content = await this.fileHandling.renderTemplate(reportTemplate, {
      data,
    });
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `patient-daily-count-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }

  async getSalesDailyReport(body, user): Promise<any> {
    const startDate = new Date(body.date);
    const endDate = new Date(body.date);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    const startDateWithoutTime = startDate;
    let endDateWithoutTime = startDate;
    endDateWithoutTime.setDate(endDateWithoutTime.getDate() + 1);
    endDateWithoutTime.setDate(0);

    const endDateWithoutTimeMonth = endDateWithoutTime.getMonth() + 1;
    const endDateWithoutTimeYear = endDateWithoutTime.getFullYear() % 100;

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear() % 100;

    if (month === endDateWithoutTimeMonth && year === endDateWithoutTimeYear) {
      endDateWithoutTime = new Date();
    }

    const startDateStamp = new Date(startDate).getTime() / 1000;
    const endDateStamp = new Date(endDate).getTime() / 1000;

    const patients = await this.patientRep
      .createQueryBuilder('patient')
      .select('patient.*,appointment.lab_number,appointment.is_completed')
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawMany();

    let totals = {
      total: 0,
      due: 0,
      discount: 0,
      paid: 0,
      total_amount_ary: 0,
      discount_amount_ary: 0,
      due_amount_ary: 0,
      paid_amount_ary: 0,
    };
    const dates = await this.fileHandling.getDatesFromRange(
      startDateWithoutTime,
      endDateWithoutTime,
    );
    let filterDates = [];
    for (let i = 0; i < dates.length; i++) {
      let dateItem = this.formatDate(dates[i]);
      let total_amount_ary = await this.fileHandling.separateDecimalValue(0);
      let discount_amount_ary = await this.fileHandling.separateDecimalValue(0);
      let due_amount_ary = await this.fileHandling.separateDecimalValue(0);
      let paid_amount_ary = await this.fileHandling.separateDecimalValue(0);
      filterDates.push({
        date: dateItem,
        total_amount_ary,
        discount_amount_ary,
        due_amount_ary,
        paid_amount_ary,
      });
      for (let j = 0; j < patients.length; j++) {
        let item = patients[j];
        if (this.formatDate(item.created_at) === dateItem) {
          const invoice = await this.invoiceRep
            .createQueryBuilder('invoice')
            .select('invoice.*')
            .where('invoice.patient_id = :patient_id', { patient_id: item._id })
            .getRawOne();
          if (invoice) {
            totals.total = totals.total + invoice.total_amount;
            totals.paid = totals.paid + invoice.paid_amount;
            totals.due = totals.due + invoice.due_amount;
            totals.discount = invoice.discount_amount;
            let pat_total_amount_ary =
              await this.fileHandling.separateDecimalValue(totals.total);
            let pat_discount_amount_ary =
              await this.fileHandling.separateDecimalValue(totals.discount);
            let pat_due_amount_ary =
              await this.fileHandling.separateDecimalValue(totals.due);
            let pat_paid_amount_ary =
              await this.fileHandling.separateDecimalValue(totals.paid);
            Object.assign(totals, {
              total_amount_ary: pat_total_amount_ary,
              discount_amount_ary: pat_discount_amount_ary,
              due_amount_ary: pat_due_amount_ary,
              paid_amount_ary: pat_paid_amount_ary,
            });
          }
        }
      }
    }
    return {
      dataset: filterDates,
      totals,
    };
  }

  async printSalesDailyReport(body, user): Promise<any> {
    let reportData = await this.getSalesDailyReport(body, user);
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const data = {
      labModel,
      startDate: body.date,
      endDate: body.date,
      reportDataTotals: reportData,
    };
    const reportTemplate = 'daily_sales_report';
    const content = await this.fileHandling.renderTemplate(reportTemplate, {
      data,
    });
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `patient-daily-sales-report-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }

  async getDuePaymentReport(body, user): Promise<any> {
    const startDate = new Date(body.start_date).getTime();
    const endDate = new Date(body.end_date).getTime();
    const facility_id = user.facility_id;

    const patients = await this.patientRep
      .createQueryBuilder('patient')
      .select(
        'patient.age,patient.age_unit,patient.gender,patient.mobile_number,patient.name,patient.registration_date,patient.created_at as registration_date_formatted,patient.unique_id,patient._id,appointment.lab_number,appointment.is_completed',
      )
      .leftJoin('patient.appointment', 'appointment')
      .where('patient.facility_id = :facility_id', { facility_id })
      .andWhere('patient.deleted_at IS NULL')
      //   .andWhere('patient.registration_date >= :start_date', {
      //     start_date: startDate,
      //   })
      //   .andWhere('patient.registration_date <= :end_date', {
      //     end_date: endDate,
      //   })
      .orderBy('patient.registration_date', 'DESC')
      .getRawMany();

    let payment = {
      due: 0,
      total: 0,
    };

    for (let i = 0; i < patients.length; i++) {
      let item = patients[i];
      const invoice = await this.invoiceRep
        .createQueryBuilder('invoice')
        .select('invoice.*')
        .where('invoice.patient_id = :patient_id', { patient_id: item._id })
        .getRawOne();
      if (invoice) {
        payment.due = payment.due + invoice.due_amount;
        Object.assign(item, { due_payment: invoice.due_amount });
      }
    }

    return {
      dataset: patients,
      payment: payment,
    };
  }

  async printDuePaymentReport(body, user): Promise<any> {
    let reportData = await this.getDuePaymentReport(body, user);
    const labModel = await this.labRep
      .createQueryBuilder('laboratory')
      .select('laboratory.*')
      .where('laboratory.facility_id = :facility_id', {
        facility_id: user.facility_id,
      })
      .getRawOne();

    const data = {
      labModel,
      startDate: body.start_date,
      endDate: body.end_date,
      reportDataTotals: reportData,
    };
    const reportTemplate = 'patient_due_payment_report';
    const content = await this.fileHandling.renderTemplate(reportTemplate, {
      data,
    });
    const folderPath = process.cwd() + '/src/common/uploads/invoices';
    const fileName = `patient-due-payment-report-${new Date().getTime()}.pdf`;
    const filePath = path.join(folderPath, fileName);
    return await this.fileHandling.generatePdf(options, content, filePath);
  }
}
