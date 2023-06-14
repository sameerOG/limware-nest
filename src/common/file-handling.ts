import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'html-pdf';
import puppeteer from 'puppeteer';

export class FileHandling {
  async renderTemplate(template: string, data: any): Promise<string> {
    const templatePath = path.join(
      __dirname,
      `../../templates/${template}.ejs`,
    ); // Update the path to your template file
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    let templateData = data; // Create an object with the labName variable
    return ejs.render(templateContent, templateData);
  }

  async generatePdf(options: any, content: any, filePath: string) {
    // return new Promise((resolve, reject) => {
    //   pdf.create(content, options).toFile(filePath, (err, res) => {
    //     if (err) {
    //       console.error(err);
    //       reject(err);
    //     } else {
    //       console.log(res, filePath);
    //       fs.readFile(res.filename, (err, fileData) => {
    //         if (err) {
    //           console.error(err);
    //           reject(err);
    //         } else {
    //           resolve(fileData);
    //         }
    //       });
    //     }
    //   });
    // });
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(content);
      await page.pdf({ path: filePath, format: 'A4' });
      await browser.close();

      const fileData = await fs.promises.readFile(filePath);
      return fileData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async separateDecimalValue(number) {
    const formattedNumber = number.toFixed(2);
    const ary = formattedNumber.split('.');

    return {
      whole_number: ary[0],
      decimal_number: ary[1],
    };
  }

  async getDatesFromRange(start, end, format = 'YYYY-MM-DD') {
    const array = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);

    for (
      let date = new Date(startDate);
      date < endDate;
      date.setDate(date.getDate() + 1)
    ) {
      // array.push(date.toLocaleDateString(format));
      array.push(date);
    }

    return array;
  }

  async formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
