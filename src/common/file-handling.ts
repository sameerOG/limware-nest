import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
// import * as pdf from 'html-pdf';
import * as pdfkit from 'pdfkit';
import * as htmlToImage from 'html-to-image';
import * as puppeteer from 'puppeteer';
const pdf = require('html-pdf-node');

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

    // const browser = await puppeteer.launch({ headless: 'new' });
    // const page = await browser.newPage();
    // await page.setContent(content);

    // await page.emulateMediaType('screen');
    // const pdfBuffer = await page.pdf({
    //   path: filePath,
    //   format: 'A4',
    //   margin: {
    //     left: '10px',
    //     right: '10px',
    //     top: '0px',
    //     bottom: '0px',
    //   },
    //   displayHeaderFooter: true,
    //   headerTemplate: '<div style="height: 10px;"></div>',
    //   footerTemplate: '<div style="height: 8px;"></div>',
    // });

    // await browser.close();

    // return new Promise<Buffer>((resolve, reject) => {
    //   fs.writeFile(filePath, pdfBuffer, (err) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       fs.readFile(filePath, (err, fileData) => {
    //         if (err) {
    //           reject(err);
    //         } else {
    //           resolve(fileData);
    //         }
    //       });
    //     }
    //   });
    // });

    return new Promise((resolve, reject) => {
      pdf
        .generatePdf({ content }, options)
        .then((pdfBuffer) => {
          fs.writeFile(filePath, pdfBuffer, (err) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              fs.readFile(filePath, (err, fileData) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  resolve(fileData);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
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
